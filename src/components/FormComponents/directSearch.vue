<template>
    <el-form ref="form" inline :model="form" :label-position="labelPosition" :label-width="labelWidth" :size="size" class="el-form-self" :style="formStyle" @submit.native.prevent>
        <template v-for="(item,index) in forms">
            <el-form-item v-if="!item.hidden" :key="index" :label="`${item.label}：`" :prop="item.prop" :rules="item.rules" :label-width="item.labelWidth" :style="item.style">

                <span slot="label" v-if="item.labelSpecial&&item.color">{{item.labelSpecial}}</span> -->
                <span slot="label" v-if="!item.label"></span>
                <!-- 输入框 -->
                <el-input v-if="item.type === 'input'" v-model="form[item.prop]" :disabled="item.disabled" :clearable="item.clearable || true" :maxlength="item.maxlength" :placeholder="item.placeholder" :style="itemStyle || item.style" @clear="handleSearch" @keyup.enter.native="handleSearch">
                    <template v-if="item.slot" :slot="item.slot.slot">
                        <el-button v-if="item.slot.type === 'button'" :icon="item.slot.icon" @click="handleSearch"></el-button>
                    </template>
                </el-input>

                <!-- 日期区间 -->
                <el-date-picker v-else-if="item.type === 'daterange'" v-model="form[item.prop]" :type="item.dateType||'daterange'" align="right" unlink-panels range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期" :picker-options="item.options" :format="item.format" :value-format="item.valueFormat" @change="handleSearch"></el-date-picker>

                <!-- 日期 -->
                <el-date-picker v-else-if="item.type === 'date'" v-model="form[item.prop]" :type="item.dateType?item.dateType:'date'" :placeholder="item.placeholder" :picker-options="item.options" :format="item.format" :value-format="item.valueFormat" @change="handleSearch" :style="itemStyle || item.style"></el-date-picker>

                <!-- 下拉框 -->
                <el-select v-else-if="item.type === 'select' && !item.isHidden" v-model="form[item.prop]" :placeholder="item.placeholder?item.placeholder:'请选择'" :clearable="true" @change="item.func?item.func($event):handleSearch()" :style="itemStyle || item.style" :multiple="item.multiple">
                    <el-option v-for="(opt,optIndex) in item.opts" :key="optIndex" :label="opt.label" :value="item.isSelect?opt.selectValue:opt.value"></el-option>
                </el-select>

                <!-- 单选按钮 -->
                <el-radio-group v-else-if="item.type === 'radioList'" v-model="form[item.prop]" :placeholder="item.placeholder?item.placeholder:'请选择'" @change="handleSearch" :style="itemStyle">
                    <el-radio v-for="(opt,optIndex) in item.opts" :key="optIndex" :label="opt.label" :value="opt.value">{{opt.value}}</el-radio>
                </el-radio-group>

                <!-- 多选框 -->
                <el-checkbox-group v-else-if="item.type === 'checkbox'" v-model="form[item.prop]">
                    <el-checkbox v-for="(opt,optIndex) in item.opts" :key="optIndex" :label="opt.value" @change="item.func?item.func($event,opt.value):handleSearch()">
                        {{opt.label}}
                    </el-checkbox>
                </el-checkbox-group>

                <!-- 级联 -->
                <el-cascader v-else-if="item.type === 'cascader'" v-model="form[item.prop]" :style="'width:'+item.width" :options="item.options" @change="handleSearch" :change-on-select="item.changeSelect" :show-all-levels="item.showLevel"></el-cascader>

                <!-- 多选框 -->
                <el-checkbox-group v-else-if="item.type === 'checkboxList'" v-model="form[item.prop]">
                    <el-checkbox v-for="(opt,optIndex) in item.opts" :key="optIndex" :label="opt.value" @change="item.func?item.func(form,opt.value):{}">{{opt.label}}</el-checkbox>
                </el-checkbox-group>

                <!-- 按钮 -->
                <template v-else-if="item.type === 'button'">
                    <!-- 权限按钮 -->
                    <permissions-btn v-if="item.id" :id="item.id" :type="item.color" @click="item.func?item.func():handleSearch()"></permissions-btn>
                    <!-- 普通按钮 -->
                    <el-button v-else :type="item.color" :icon="item.icon" @click="item.func ? item.func(form) : handleSearch()">
                        {{ item.value }}
                    </el-button>
                </template>
            </el-form-item>
        </template>
    </el-form>
</template>

<script>
import permissionsBtn from '../PermissionsBtn/btn'
export default {
    components: {
        permissionsBtn
    },
    props: {
        size: { type: String, default: 'small' },
        labelPosition: { type: String, default: 'right' },
        labelWidth: { type: String },
        formStyle: { type: Object },
        forms: { type: Array }, // 表单组
        formDefaults: { type: Object },
        itemStyle: { type: Object }
    },
    data() {
        return {
            form: {}
        }
    },
    methods: {
        // 表单赋值
        initforms() {
            // this.$nextTick(() => {
            const form = {}
            this.forms.forEach(item => {
                if (!item.prop || item.hidden) return false
                if (
                    item.type === 'daterange' ||
                    item.type === 'checkbox' ||
                    item.type === 'checkboxList' ||
                    item.type === 'cascader' ||
                    (item.type === 'select' && item.multiple)
                ) {
                    form[item.prop] = []
                } else {
                    form[item.prop] = ''
                }
            })
            if (this.formDefaults) {
                this.form = Object.assign(form, this.formDefaults)
            } else {
                this.form = Object.assign({}, form)
            }
            this.loading = false
            if (this.$refs.form && this.$refs.form.clearValidate) {
                this.$refs.form.clearValidate()
            }
            // })
        },

        // 查询
        handleSearch() {
            this.$emit('handleSearch', this.form)
        },

        // 给Form赋值
        initFields(obj) {
            this.form = obj
            this.$nextTick(() => {
                if (this.$refs.form && this.$refs.form.clearValidate) {
                    this.$refs.form.clearValidate()
                }
            })
        },

        // 给字段赋值
        initFieldsObj(obj) {
            for (const key in obj) {
                this.form[key] = obj[key]
            }
            this.$nextTick(() => {
                if (this.$refs.form && this.$refs.form.clearValidate) {
                    this.$refs.form.clearValidate()
                }
            })
        }
    },
    created() {
        this.initforms()
    }
    // mounted() {
    //     this.initforms()
    // }
}
</script>

<style lang="scss" scoped>
.el-form-self {
    .el-form-item {
        margin-bottom: 10px !important;
    }
}
</style>
<style>
.el-form-self .el-collapse-item__header {
    height: 0;
    line-height: 0;
}

.el-form-self .el-collapse {
    border: 0 !important;
}
.el-form-self .el-collapse-item__header {
    border: 0 !important;
}
.el-form-self .el-collapse-item__arrow {
    display: none;
}
</style>



