<template>
  <div class="row">
    <div class="col-lg-12">
      <form class="form-inline pb-3">
        <input @input="setFilter($event.target.value)" class="form-control w-100" type="search" :value="filter" :placeholder="placeholder || 'Search'">
      </form>
    </div>
  </div>
</template>

<!-- // // // // -->

<script>
import { mapGetters, mapActions } from 'vuex'

export default {
  name: 'search',
  props: ['module', 'placeholder'],
  beforeCreate () {
    // Isolates the 'module' prop
    let module = this.$options.propsData.module

    // Defines Vue.component.computed
    this.$options.computed = mapGetters({
      filter: `${module}/filter`
    })

    // Defines Vue.component.methods
    this.$options.methods = mapActions({
      setFilter: `${module}/setFilter`
    })
  }
}
</script>
