<template>
  <div class="row justify-content-center">

    <div class="col-sm-12 col-md-8" v-if="model && model.beds_code">
      <p class="lead font-weight-bold mb-0">
        {{ model.name }}
        <small class="text-muted">{{ model.district }}</small>
      </p>
    </div>
    <div class="col-sm-12 col-md-4 text-right" v-if="model && model.beds_code">
      <span class="badge badge-primary px-1 py-2">{{ model.sector }}</span>
    </div>

    <div class="col-lg-12">
      <hr>
    </div>

    <div class="col-lg-6">

      <div class="row">
        <div class="col-lg-12">
          <span class="badge badge-lg py-2 mb-2 badge-primary">
            <i class="fa fa-star"></i>
            Rank: {{ ordinalPercentile }} percentile
          </span>
        </div>

        <div class="col-lg-6 mr-0">
          <span class="badge badge-lg mb-2 badge-success" v-b-tooltip.hover.right title="Faucets within CDC reccommended lead concentration">
            <i class="fa fa-check"></i>
            <!-- < 15 PPB: {{ model.outlets_leq_15ppb }} -->
          </span>
        </div>

        <div class="col-lg-6 ml-0">
          <span class="badge badge-lg mb-2 badge-danger" v-b-tooltip.hover.right title="Faucets exceeding CDC reccommended lead concentration">
            <i class="fa fa-warning"></i>
            <!-- > 15 PPB: {{ model.outlets_gt_15ppb }} -->
          </span>
        </div>

        <div class="col-lg-12">
          <span class="badge badge-lg mb-2 badge-light" v-b-tooltip.hover.right title="Whether or not the building(s) are lead-free">
            <i class="fa fa-tint"></i>
            Lead Free: {{ model.lead_free }}
          </span>
        </div>

      </div>

      <span class="badge badge-lg mb-2 badge-light">
        <i class="fa fa-calendar-o"></i>
        Sampling Date: {{ model.sampling_update_date }}
      </span>

      <br>

      <span class="badge badge-lg mb-2 badge-light" v-b-tooltip.hover.right title="Total number of faucets on premises">
        <i class="fa fa-hashtag"></i>
        Total Outlets: {{ model.outlets }}
      </span>

      <br>

      <span class="badge badge-lg mb-2 badge-light" v-b-tooltip.hover.right title="Total number of sampled faucets on premises">
        <i class="fa fa-hashtag"></i>
        Outlets Sampled: {{ model.outlets_sampled_post_regulation }}
      </span>

      <br>


      <!-- {{ model.stats }} -->

    </div>

    <div class="col-lg-6">
      <PieChart v-if="model.outlets_sampled_post_regulation && model.stats.pct_compliant" />
      <div class="card card-body border-warning bg-dark text-warning text-center" v-else>
        <p class="lead mb-0">
          Insufficient data for visualization.
        </p>
      </div>
    </div>

  </div>
</template>

<!-- // // // //  -->

<script>
import PieChart from './PieChart'
import { mapGetters } from 'vuex'

export default {
  name: 'school_detail',
  components: {
    PieChart
  },
  computed: {
    ...mapGetters({
      model: 'school/model'
    }),
    address () {
      let address = this.model.address
      return `${address.street}, ${address.city}, ${address.state} ${address.zipcode}`
    },
    mapUrl () {
      const searchUrl = 'https://maps.google.com/'
      return [searchUrl, '?q=', encodeURIComponent(this.address)].join('')
    },
    ordinalPercentile () {
      let rank = this.model.stats.rank
      rank = rank.toFixed(0)
      let lastChar = rank[rank.length - 1]
      if (['0', '4', '5', '6', '7', '8', '9'].includes(lastChar)) {
        rank = rank + 'th'
      } else if (['1'].includes(lastChar)) {
        rank = rank + 'th'
      } else if (['2'].includes(lastChar)) {
        rank = rank + 'nd'
      } else {
        rank = rank + 'rd'
      }
      return rank
    }
  }
}
</script>

<style lang="sass">
  span.badge-lg
    font-size: 1rem
    width: 100%
</style>
