<template>
    <div class="app-container">
        <el-table-self :list-loading="listLoading" :current-page="pageIndex" :table-data="tabData" :columns="tabColumns" :total-count="total" :page-sizes="pageSizes" :page-size="pageSize" @pageSizeChange="handleSizeChange" @currentPageChange="handleCurrentChange" />
    </div>
</template>

<script>
import { getList } from '@/api/table'
import elTableSelf from '@/components/TabComponents/index'
import paginationMixin from '@/components/TabComponents/mixin'

export default {
    components: {
        elTableSelf
    },
    mixins: [paginationMixin],
    data() {
        return {
            list: null,
            total: 0,
            listLoading: true,
            tabData: [],
            tabColumns: [
                {
                    value: 'title',
                    width: 100,
                    label: '标题'
                },
                {
                    value: 'author',
                    label: '作者'
                },
                {
                    value: 'pageviews',
                    width: 150,
                    label: '电话'
                },
                {
                    value: 'display_time',
                    width: 120,
                    label: '创建时间'
                },
                {
                    label: '操作',
                    fixed: 'right',
                    width: 200,
                    operType: 'button',
                    operations: [
                        {
                            label: '编辑',
                            type: 'primary',
                            func: this.handleEdit
                        },
                        {
                            label: '删除',
                            type: 'danger',
                            func: this.handleDel
                        }
                    ]
                }
            ]
        }
    },
    created() {
        this.handleSearch(0,10)
    },
    methods: {
        handleSearch(val1,val2) {
            this.listLoading = true
            getList().then(res => {
                const d = res.data.items
                this.total = d.length
                this.tabData = d.splice(val1,val2)
                this.listLoading = false
            })
        }
    }
}
</script>
