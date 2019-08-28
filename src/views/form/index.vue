<template>
    <div class="app-container">
        <elFormSelf ref="addForm" :forms="formDoms" @handleConfirm="handleConfirm"></elFormSelf>
    </div>
</template>

<script>
import elFormSelf from '@/components/FormComponents/index'
export default {
    components: {
        elFormSelf
    },
    data() {
        return {
            formDoms: [
                {
                    type: 'input',
                    label: '编号',
                    prop: 'code',
                    rules: [{ required: true, message: '编号必填', trigger: 'blur' }]
                },
                {
                    type: 'input',
                    label: '简称',
                    prop: 'shortName',
                    rules: [{ required: true, message: '简称必填', trigger: 'blur' }]
                },
                {
                    type: 'input',
                    label: '名称',
                    prop: 'name',
                    rules: [{ required: true, message: '名称必填', trigger: 'blur' }]
                },
                {
                    type: 'input',
                    label: '联系人',
                    prop: 'contacts'
                },
                {
                    type: 'input',
                    label: '联系方式',
                    prop: 'contactPhone',
                    placeholder: '请输入手机号或固定电话',
                    rules: [
                        {
                            trigger: 'blur',
                            validator(rule, value, callback) {
                                if (value) {
                                    const phone = /(^1[3|4|5|7|8|9][0-9]{9}$)|(^(\d{3,4}-)\d{7,8}$)/ // 手机号码|固定电话
                                    if (!phone.test(value)) {
                                        callback(new Error('手机号码或固定电话不正确'))
                                    } else {
                                        callback()
                                    }
                                }
                            }
                        }
                    ]
                },
                {
                    type: 'input',
                    label: '邮箱',
                    prop: 'email',
                    rules: [
                        {
                            pattern: /^([A-Za-z0-9_\-\.\u4e00-\u9fa5])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,8})$/,
                            message: '请输入正确的邮箱',
                            trigger: 'blur'
                        }
                    ]
                },
                {
                    type: 'input',
                    label: '地址',
                    id: 'addressId',
                    prop: 'address'
                },
                {
                    type: 'textarea',
                    label: '备注',
                    lg: 24,
                    md: 24,
                    xl: 24,
                    sm: 24,
                    xs: 24,
                    autosize: { minRows: 4, maxRows: 14 },
                    prop: 'note'
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
            }
        }
    },
    methods: {
        handleConfirm() {},
        onSubmit() {
            this.$message('submit!')
        },
        onCancel() {
            this.$message({
                message: 'cancel!',
                type: 'warning'
            })
        }
    }
}
</script>

<style scoped>
.line {
    text-align: center;
}
</style>

