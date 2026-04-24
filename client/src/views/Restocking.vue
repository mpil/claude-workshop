<template>
  <div class="restocking">
    <div class="page-header">
      <h2>{{ t('restocking.title') }}</h2>
      <p>{{ t('restocking.description') }}</p>
    </div>

    <!-- Budget input -->
    <div class="budget-bar card">
      <label class="budget-label">{{ t('restocking.budgetLabel') }}</label>
      <div class="budget-input-group">
        <span class="currency-prefix">$</span>
        <input
          v-model.number="budgetInput"
          type="number"
          min="0"
          step="1000"
          :placeholder="t('restocking.budgetPlaceholder')"
          class="budget-input"
          @keyup.enter="applyBudget"
        />
        <button class="btn-apply" @click="applyBudget">{{ t('restocking.apply') }}</button>
        <button v-if="activeBudget != null" class="btn-clear" @click="clearBudget">{{ t('restocking.clear') }}</button>
      </div>
    </div>

    <div v-if="loading" class="loading">{{ t('common.loading') }}</div>
    <div v-else-if="error" class="error">{{ error }}</div>
    <div v-else>
      <!-- Summary stats -->
      <div class="stats-grid" v-if="summary">
        <div class="stat-card" :class="summary.items_below_reorder > 0 ? 'warning' : 'success'">
          <div class="stat-label">{{ t('restocking.stats.belowReorder') }}</div>
          <div class="stat-value">{{ summary.items_below_reorder }}</div>
        </div>
        <div class="stat-card info">
          <div class="stat-label">{{ t('restocking.stats.withinBudget') }}</div>
          <div class="stat-value">{{ summary.items_within_budget }}</div>
        </div>
        <div class="stat-card">
          <div class="stat-label">{{ t('restocking.stats.totalCost') }}</div>
          <div class="stat-value">${{ formatNumber(summary.total_cost) }}</div>
        </div>
        <div class="stat-card" v-if="activeBudget != null" :class="budgetRemaining >= 0 ? 'success' : 'danger'">
          <div class="stat-label">{{ t('restocking.stats.remaining') }}</div>
          <div class="stat-value">${{ formatNumber(budgetRemaining) }}</div>
        </div>
      </div>

      <!-- Empty state -->
      <div v-if="recommendations.length === 0 && summary && summary.items_below_reorder === 0" class="empty-state card">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
          <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <p>{{ t('restocking.noDeficits') }}</p>
      </div>

      <div v-else>
        <!-- Budget hint -->
        <div v-if="activeBudget == null && recommendations.length > 0" class="budget-hint">
          {{ t('restocking.enterBudget') }}
        </div>

        <!-- Recommendations table -->
        <div class="card">
          <div class="card-header">
            <h3 class="card-title">
              {{ recommendations.length }} {{ recommendations.length === 1 ? 'item' : 'items' }}
              <span v-if="summary && summary.items_skipped > 0" class="skipped-note">
                ({{ summary.items_skipped }} skipped — over budget)
              </span>
            </h3>
          </div>
          <div class="table-container">
            <table>
              <thead>
                <tr>
                  <th>{{ t('restocking.table.sku') }}</th>
                  <th>{{ t('restocking.table.item') }}</th>
                  <th>{{ t('restocking.table.category') }}</th>
                  <th>{{ t('restocking.table.warehouse') }}</th>
                  <th class="num">{{ t('restocking.table.onHand') }}</th>
                  <th class="num">{{ t('restocking.table.reorderPt') }}</th>
                  <th class="num">{{ t('restocking.table.deficit') }}</th>
                  <th class="num">{{ t('restocking.table.recQty') }}</th>
                  <th class="num">{{ t('restocking.table.unitCost') }}</th>
                  <th class="num">{{ t('restocking.table.estCost') }}</th>
                  <th>{{ t('restocking.table.trend') }}</th>
                  <th>{{ t('restocking.table.priority') }}</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="rec in recommendations" :key="rec.sku">
                  <td><code class="sku">{{ rec.sku }}</code></td>
                  <td>{{ rec.name }}</td>
                  <td>{{ rec.category }}</td>
                  <td>{{ rec.warehouse }}</td>
                  <td class="num">{{ rec.quantity_on_hand }}</td>
                  <td class="num">{{ rec.reorder_point }}</td>
                  <td class="num deficit">{{ rec.deficit }}</td>
                  <td class="num"><strong>{{ rec.recommended_qty }}</strong></td>
                  <td class="num">${{ rec.unit_cost.toFixed(2) }}</td>
                  <td class="num cost">${{ formatNumber(rec.estimated_cost) }}</td>
                  <td>
                    <span :class="['badge', rec.trend]">{{ rec.trend }}</span>
                  </td>
                  <td>
                    <span :class="['badge', rec.priority]">{{ rec.priority }}</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, watch, onMounted } from 'vue'
import { api } from '../api'
import { useFilters } from '../composables/useFilters'
import { useI18n } from '../composables/useI18n'

export default {
  name: 'Restocking',
  setup() {
    const { getCurrentFilters, selectedLocation, selectedCategory } = useFilters()
    const { t } = useI18n()

    const loading = ref(true)
    const error = ref(null)
    const recommendations = ref([])
    const summary = ref(null)
    const budgetInput = ref(null)
    const activeBudget = ref(null)

    const budgetRemaining = computed(() => {
      if (activeBudget.value == null || !summary.value) return 0
      return activeBudget.value - summary.value.total_cost
    })

    const loadData = async () => {
      try {
        loading.value = true
        error.value = null
        const filters = getCurrentFilters()
        if (activeBudget.value != null) filters.budget = activeBudget.value
        const result = await api.getRestockingRecommendations(filters)
        recommendations.value = result.recommendations
        summary.value = result.summary
      } catch (err) {
        error.value = 'Failed to load recommendations: ' + err.message
      } finally {
        loading.value = false
      }
    }

    const applyBudget = () => {
      activeBudget.value = budgetInput.value || null
      loadData()
    }

    const clearBudget = () => {
      budgetInput.value = null
      activeBudget.value = null
      loadData()
    }

    watch([selectedLocation, selectedCategory], loadData)
    onMounted(loadData)

    const formatNumber = (num) =>
      Number(num).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })

    return {
      loading, error, recommendations, summary,
      budgetInput, activeBudget, budgetRemaining,
      applyBudget, clearBudget, formatNumber, t
    }
  }
}
</script>

<style scoped>
.restocking {
  padding: 0;
}

.budget-bar {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.25rem;
  flex-wrap: wrap;
}

.budget-label {
  font-weight: 600;
  color: #374151;
  font-size: 0.875rem;
  white-space: nowrap;
}

.budget-input-group {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.currency-prefix {
  font-weight: 600;
  color: #6b7280;
  font-size: 1rem;
}

.budget-input {
  width: 200px;
  padding: 0.5rem 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 0.938rem;
  color: #111827;
  outline: none;
  transition: border-color 0.15s;
}

.budget-input:focus {
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.btn-apply {
  padding: 0.5rem 1.25rem;
  background: #2563eb;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.15s;
}

.btn-apply:hover {
  background: #1d4ed8;
}

.btn-clear {
  padding: 0.5rem 1rem;
  background: transparent;
  color: #6b7280;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.15s;
}

.btn-clear:hover {
  background: #f3f4f6;
  color: #374151;
}

.budget-hint {
  background: #eff6ff;
  border: 1px solid #bfdbfe;
  color: #1e40af;
  padding: 0.75rem 1rem;
  border-radius: 8px;
  font-size: 0.875rem;
  margin-bottom: 1rem;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  padding: 3rem;
  text-align: center;
  color: #059669;
}

.empty-state p {
  font-size: 1rem;
  font-weight: 500;
}

.skipped-note {
  font-size: 0.813rem;
  font-weight: 400;
  color: #9ca3af;
  margin-left: 0.5rem;
}

.sku {
  font-family: monospace;
  font-size: 0.813rem;
  color: #4b5563;
  background: #f3f4f6;
  padding: 0.125rem 0.375rem;
  border-radius: 4px;
}

.num {
  text-align: right;
}

.deficit {
  color: #dc2626;
  font-weight: 600;
}

.cost {
  font-weight: 600;
  color: #0f172a;
}
</style>
