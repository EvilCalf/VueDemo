const mixin = {
  data() {
    return {
      total: 0,
      pageIndex: 1,
      pageSize: 10,
      pageSizes: [10, 20, 50, 100]
    }
  },
  methods: {
    // 跳转页码
    handleCurrentChange(val) {
      this.pageIndex = val
      this.handleSearch(this.pageIndex,this.pageSize)
    },

    // 切换页面显示条数
    handleSizeChange(val) {
      this.pageSize = val
      this.handleSearch(this.pageIndex,this.pageSize)
    }
  }
}
export default mixin
