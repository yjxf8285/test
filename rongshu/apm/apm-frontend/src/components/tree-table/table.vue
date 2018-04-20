<style lang="scss">
.aux-table {
  width: 100%;
  & > tr:not(:last-child),
  tbody > tr,
  tfoot > tr:not(:last-child),
  thead > tr {
    background-color: #fff;
    border-bottom-width: 1px;
    border-bottom-style: solid;
    border-color: #dfe6ec;
    th {
      background-color: #eef1f6;
    }
    &.hover-row {
      background-color: #eef1f6;
    }
  }
  th,
  td {
    white-space: nowrap;
    vertical-align: middle;
    padding: 3px;
    line-height: 14px;
    height: 24px;
    text-align: left;
    color: #000;
  }
  th {
    font-size: 12px;
    padding: 10px;
  }
  td {
    font-size: 12px;
  }
  tfoot td:only-child {
    font-size: 12px;
    text-align: right;
  }
}
// stripe table
.aux-striped {
  tbody > tr:nth-child(2n) {
    background-color: #fafafa;
  }
}
.aux-bordered {
  border-width: 1px;
  border-style: solid;
  border-color: #dfe6ec;
  th:not(:last-child),
  td:not(:last-child) {
    border-right-width: 0px;
    border-color: #dfe6ec;
    border-right-style: solid;
  }
  thead > tr:last-child,
  tbody > tr:last-child {
    border-bottom-width: 1px;
    border-bottom-style: solid;
  }
}
</style>

<template>
  <table class="
    aux-table"
    :class="{ 'aux-bordered' : bordered }" ref="table">
    <slot></slot>
  </table>
</template>

<script>
export default {
  name: 'aux-table',
  props: {
    striped: Boolean,
    bordered: Boolean
  },
  mounted() {}
}
</script>

