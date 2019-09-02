<template>
  <div v-if="!addshow"
class="app-container">
    <el-table-self :list-loading="listLoading"
:current-page="pageIndex" :table-data="tabData" :columns="tabColumns" :total-count="total" :page-sizes="pageSizes" :page-size="pageSize" @pageSizeChange="handleSizeChange" @currentPageChange="handleCurrentChange" />
  </div>

  <div v-else-if="addshow"
class="app-container" style="text-align:center">
    <elFormSelf ref="addForm"
:forms="formDoms" />
    <el-button @click="changeShow">
      返回
    </el-button>
  </div>
</template>

<script>
import { getList } from '@/api/table'
import elTableSelf from '@/components/TabComponents/index'
import paginationMixin from '@/components/TabComponents/mixin'
import elFormSelf from '@/components/FormComponents/index'

export default {
    components: {
        elTableSelf,
        elFormSelf
    },
    mixins: [paginationMixin],
    data() {
        return {
            list: null,
            addshow: false,
            total: 0,
            listLoading: true,
            tabData: [],
            pageIndex: 1,
            formDoms: [
                {
                    type: 'input',
                    label: '标题',
                    prop: 'code',
                    rules: [{ required: true, message: '标题必填', trigger: 'blur' }]
                },
                {
                    type: 'input',
                    label: '作者',
                    prop: 'shortName',
                    rules: [{ required: true, message: '作者必填', trigger: 'blur' }]
                },
                {
                    type: 'input',
                    label: '电话',
                    prop: 'name',
                    rules: [{ required: true, message: '电话必填', trigger: 'blur' }]
                }
            ],
            form: {
                name: '',
                region: '',
                date1: '',
                date2: '',
                delivery: false,
                type: [],
                resource: '',
                desc: ''
            },

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
        this.handleSearch()
    },
    methods: {
        handleSearch() {
            this.listLoading = true
            getList().then(res => {
                const d = res.data.items
                this.total = d.length
                this.tabData = d.splice(this.pageSize * (this.pageIndex - 1), this.pageSize)
                this.listLoading = false
            })
        },

        handleEdit() {
            this.addshow = true
        },

        changeShow() {
            this.addshow = false
        },

        handleDel() {
            console.log('delete it!')
        }
    }
}
</script>
