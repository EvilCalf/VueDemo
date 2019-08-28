<template>
    <el-row class="el-table-self">
        <el-table ref="selftab" v-loading="listLoading" :row-key="rowKey" :size="tabSize" :summary-method="getSummaries" :show-summary="showSummary" :span-method="spanMethod" :data="tableData" border :show-overflow-tooltip="true" :highlight-current-row="highLight" :max-height="maxHeight" :height="tableHeight" @row-click="rowClick" @sort-change="sortChange" @select="selectChange" @selection-change="selectionChange" :header-row-class-name="headerClass" :row-style="rowStyle" :cell-style="cellStyle" style="width: 100%;" @select-all="selectAll" @cell-click="cellClick">
            <el-table-column v-if="tabType" :type="tabType" width="55" align="center" :label="tabLabel" :selectable="selecTable" :index="tabIndex"></el-table-column>

            <template v-for="(column,index) in columns">
                <template v-if="!column.hidden">
                    <template v-if="!column.type && !column.operType">
                        <el-table-column :key="index" :show-overflow-tooltip="true" :fixed="column.fixed" :prop="column.value" :label="column.label" :width="column.width" :min-width="column.minWidth" align="center" :sortable="column.sortable" :formatter="column.formatter" :class-name="column.className" />
                    </template>
                    <template v-else>
                        <!-- 复杂表头 -->
                        <template v-if="column.type === 'complex'">
                            <el-table-column :key="index" :fixed="column.fixed" :prop="column.value" :label="column.label" :width="column.width" align="center">
                                <template v-for="(col2,col2Index) in column.list">
                                    <template v-if="!col2.hidden">
                                        <el-table-column :key="col2Index" :label="col2.label" :width="col2.width" :prop="col2.value" align="center">
                                            <template slot-scope="scope">
                                                <template v-if="col2.type === 'button' || col2.operType === 'button'">
                                                    <template v-for="(op, opIndex) in col2.operations">
                                                        <template v-if="!op.isHidden || !op.isHidden(scope.row)">
                                                            <el-button :key="opIndex" :disabled="op.formatter ? op.formatter(scope.row).disabled : false" :style="op.style" :type="op.formatter? op.formatter(scope.row).type: op.type || ''" :icon="op.icon" @click="op.func(scope.row, scope.$index)">
                                                                {{ op.formatter ? op.formatter(scope.row).label : op.label ? op.label : scope.row[col2.value] }}
                                                            </el-button>
                                                        </template>
                                                    </template>
                                                </template>

                                                <template v-if="col2.operType === 'input'">
                                                    <template v-if="col2.type === 'number'">
                                                        <el-input-number :controls="false" :min="col2.min|| scope.row['min'] || 0" :precision="col2.precision" v-model="scope.row[col2.value]" v-if="col2.showInput?col2.showInput:scope.row.showInput" @change="col2.func?col2.func(scope.row,scope.$index):{}" @input="handleEdit(scope.$index,scope.row[col2.value],scope.row,col2.value)" @blur="col2.blurFunc?col2.blurFunc(scope.row,scope.$index):{}" @keydown.native.enter="col2.enterFunc?col2.enterFunc(scope.row,scope.$index):{}" :disabled="col2.disabled || disabled" />
                                                        <span class="tableSpan" v-else>{{scope.row[col2.value]}}</span>
                                                    </template>
                                                    <template v-else>
                                                        <el-input v-model="scope.row[col2.value]" v-if="col2.showInput?col2.showInput:scope.row.showInput" :autofocus="scope.row[col2.autofocus]" @input="handleEdit(scope.$index,scope.row[col2.value],scope.row,col2.value)" @blur="col2.blurFunc?col2.blurFunc(scope.row,scope.$index):{}" @keydown.native.enter="col2.enterFunc?col2.enterFunc(scope.row,scope.$index):{}" :disabled="disabled" :size="col2.size" />
                                                        <span class="tableSpan" v-else>{{scope.row[col2.value]}}</span>
                                                    </template>
                                                </template>

                                                <template v-else-if="col2.operType === 'select'">
                                                    <el-select v-model="scope.row[col2.value]" @change="col2.enterFunc?col2.enterFunc(scope.row,scope.$index):changeProject(scope.row[col2.value],scope.$index)" filterable clearable placeholder="请选择" @focus="changeSelect(scope.row)" no-data-text=" " no-match-text=" " :disabled="disabled" :remote="col2.remote" :allow-create="col2.allowCreate" :remote-method="col2.remoteMethod">
                                                        <el-option v-for="item in col2.opts?col2.opts:scope.row.opts" :key="item.value" :label="item.label" :value="col2.isSelect?item.selectValue:item.value"></el-option>
                                                    </el-select>
                                                </template>
                                            </template>
                                        </el-table-column>
                                    </template>
                                </template>
                            </el-table-column>
                        </template>

                        <template v-else>
                            <el-table-column :key="index" :fixed="column.fixed" :prop="column.value" :label="column.label" :sortable="column.sortable" :width="column.width" align="center">
                                <template slot-scope="scope">
                                    <!-- 按钮 -->
                                    <template v-if="column.type === 'button' || column.operType === 'button'">
                                        <template v-for="(op, opIndex) in column.operations">
                                            <template v-if="!op.isHidden || !op.isHidden(scope.row)">
                                                <el-button :key="opIndex" :disabled="op.formatter ? op.formatter(scope.row).disabled : false" :style="op.style" :type="op.formatter? op.formatter(scope.row).type: op.type || ''" :icon="op.icon" @click="op.func(scope.row, scope.$index)">
                                                    {{ op.formatter ? op.formatter(scope.row).label : op.label ? op.label : scope.row[column.value] }}
                                                </el-button>
                                            </template>
                                        </template>
                                    </template>
                                    <template v-if="column.operType === 'svg'">
                                        <template v-for="(operate,operIndex) in column.operations.formatter?column.operations.formatter(scope.row):column.operations" v-if="!operate.isHidden ||!operate.isHidden(scope.row)">
                                            <el-tooltip v-if="operate.tips" effect="dark" :open-delay="200" placement="top-start" :key="operIndex+Date.parse(new Date())">
                                                <span slot="content">{{operate.tips}}</span>
                                                <svg-icon :style="operate.style" :icon-class="operate.iconClass" @click.native="operate.func?operate.func(scope.row,scope.$index):{}" class="tab-svg"></svg-icon>
                                            </el-tooltip>
                                            <svg-icon v-else :key="operIndex+Date.parse(new Date())" :style="operate.style" :icon-class="operate.iconClass" @click.native="operate.func(scope.row,scope.$index)" class="tab-svg"></svg-icon>
                                        </template>
                                    </template>

                                    <template v-if="column.operType === 'input'">
                                        <template v-if="column.type === 'number'">
                                            <el-input-number :controls="false" :min="column.min|| scope.row['min'] || 0" :precision="column.precision" v-model="scope.row[column.value]" v-if="column.showInput?column.showInput:scope.row.showInput" @change="column.func?column.func(scope.row,scope.$index):{}" @input="handleEdit(scope.$index,scope.row[column.value],scope.row,column.value)" @blur="column.blurFunc?column.blurFunc(scope.row,scope.$index):{}" @keydown.native.enter="column.enterFunc?column.enterFunc(scope.row,scope.$index):{}" :disabled="column.disabled || disabled" />
                                            <span class="tableSpan" v-else>{{scope.row[column.value]}}</span>
                                        </template>
                                        <template v-else>
                                            <el-input v-model="scope.row[column.value]" v-if="column.showInput?column.showInput:scope.row.showInput" :autofocus="scope.row[column.autofocus]" @input="handleEdit(scope.$index,scope.row[column.value],scope.row,column.value)" @blur="column.blurFunc?column.blurFunc(scope.row,scope.$index):{}" @keydown.native.enter="column.enterFunc?column.enterFunc(scope.row,scope.$index):{}" :disabled="column.disabled || disabled" :size="column.size" />
                                            <span class="tableSpan" v-else>{{scope.row[column.value]}}</span>
                                        </template>
                                    </template>

                                    <template v-if="column.operType === 'date'">
                                        <el-date-picker align="center" v-if="column.showDate" v-model="scope.row[column.value]" :picker-options="column.options" :type="column.dateType||'date'" :placeholder="scope.row[column.placeholder]" :disabled="disabled" :format="column.format" :value-format="column.valueFormat" :size="column.size"></el-date-picker>
                                        <span class="tableSpan" v-else>{{scope.row[column.value]}}</span>
                                    </template>

                                    <template v-if="column.operType === 'textarea'">
                                        <el-input type="textarea" :placeholder="column.placeholder" :rows="column.rows" :autosize="column.autosize" v-model="scope.row[column.value]" :minlength="column.minlength" :maxlength="column.maxlength" :show-word-limit="column.showLimit"></el-input>
                                    </template>

                                    <template v-else-if="column.operType === 'select'">
                                        <el-select v-model="scope.row[column.value]" @change="column.enterFunc?column.enterFunc(scope.row,scope.$index):changeProject(scope.row[column.value],scope.$index)" filterable placeholder="请选择" @focus="column.focusFunc?column.focusFunc(scope.row,scope.$index):{}" no-data-text=" " no-match-text=" " :disabled="disabled" :remote="column.remote" :allow-create="column.allowCreate" :remote-method="column.remoteMethod">
                                            <el-option v-for="item in column.opts?column.opts:scope.row.opts" :key="item.value" :label="item.label" :value="column.isSelect?item.selectValue:item.value"></el-option>
                                        </el-select>
                                    </template>
                                    <!-- 模糊查询输入 -->
                                    <el-autocomplete v-else-if="column.operType === 'autocomplete'" :popper-class="column.popperClass ? column.popperClass :'my-autocomplete'" v-model="scope.row[column.value]" :fetch-suggestions="column.searchFunc" :placeholder="column.placeholder?column.placeholder:''" :trigger-on-focus="false" clearable @select="column.selectFun?column.selectFun($event,scope.$index):{}" @input="column.inputFunc?column.inputFunc(scope.row,scope.$index,column.value):{}" @blur="column.changeFunc?column.changeFunc(scope.row,scope.$index,column.value):{}">
                                        <template slot-scope="{ item }">
                                            <div class="name">{{ item.name }}</div>
                                            <span class="desc">{{ item.desc }}</span>
                                        </template>
                                    </el-autocomplete>

                                    <template v-else-if="column.operType === 'upload'">
                                        <el-button @click="column.func(scope.$index)" style="float:left" type="primary" v-if="!scope.row.imgUrl">上传</el-button>
                                        <span style="float:left;line-height:32px;margin-left:5px;cursor:pointer;color:#409EFF" v-if="scope.row.imgUrl" @click="column.enlargeFunc(scope.row.imgUrl)">{{scope.row.imgUrl}}</span>
                                        <el-button @click="column.delFunc(scope.row,scope.$index)" style="float:left;margin-left:5px" type="primary" v-if="scope.row.imgUrl">删除</el-button>
                                    </template>
                                    <!-- 图片 -->
                                    <template v-if="column.operType === 'img'">
                                        <img class="imgs" :src="scope.row[column.value]" :style="column.style" @click="column.imgFun?column.imgFun(scope.row,scope.$index):''" />
                                    </template>

                                    <!-- 消息 -->
                                    <template v-if="column.operType === 'txt'">
                                        <div :style="column.style1">{{scope.row[column.value1]}}</div>
                                        <div :style="column.style2">{{scope.row[column.value2]}}</div>
                                    </template>
                                </template>
                            </el-table-column>
                        </template>
                    </template>
                </template>
            </template>
        </el-table>
        <div class="pagination-footer" v-if="pageSize">
            <span class="description">{{description}}</span>
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage" :page-sizes="pageSizes" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="totalCount"></el-pagination>
        </div>
    </el-row>
</template>

<script>
export default {
    name: 'el-table-self',
    props: {
        listLoading: Boolean, // tab 加载层
        rowKey: { type: String },
        highLight: { type: Boolean, default: true },
        headerClass: { type: String, default: 'default' }, // 头部背景色Class名称，默认default
        tabType: String, // 对应列的类型，selection/index/expand
        tabLabel: String,
        tableHeight: Number, // 表格的高度
        maxHeight: Number, // 表格的最大高度
        tabSize: { type: String },
        tableData: Array, // 表格数据
        columns: Array, // 表格列配置数据,{vlaue:对应数据对象中的属性，label：对应的是标题文字，fixed:列是否固定，width:列宽， sortable：是否可排序，formatter:列格式化， className：对应的是列的样式类名}
        sortChange: { type: Function, default: () => {} }, // 点击列表头进行排序 { column, prop, order }
        description: String, // 分页脚底左侧的数据说明
        totalCount: Number, // 表格数据总数
        pageSizes: Array, // 决定每页显示的条数[10,15,20,25]
        pageSize: Number,
        spanMethod: Function,
        operType: { type: String, default: 'button' },
        getSummaries: Function,
        showSummary: { type: Boolean, default: false },
        type: { type: String, default: 'text' },
        currentPage: { type: Number, default: 1 },
        selecTable: Function,
        disabled: { type: Boolean, default: false },
        tabIndex: Function,
        cellStyle: Function,
        rowStyle: Function
    },
    methods: {
        // 切换页面显示条数
        handleSizeChange(val) {
            this.$emit('pageSizeChange', val)
        },
        // 跳转页码
        handleCurrentChange(val) {
            this.$emit('currentPageChange', val)
        },

        // 复选框事件
        selectionChange(selections) {
            this.$emit('selectionChange', selections)
        },

        // 复选框选中当前行事件
        selectChange(selections, row) {
            this.$emit('selectChange', selections, row)
        },

        // 行点击
        rowClick(row, event) {
            this.$emit('rowClick', row, event)
        },

        // 行点击
        cellClick(row, column, cell, event) {
            this.$emit('cellClick', row, column, cell, event)
        },

        // 收费的输入
        handleEdit(index, value, row, pro) {
            this.$emit('number', index, value, row, pro)
        },

        changeProject(row, index) {
            this.$emit('project', row, index)
        },

        changeSelect(row) {
            this.$emit('changeSelect', row)
        },

        // 全选事件
        selectAll(selections) {
            this.$emit('selectAll', selections)
        },

        // 远程搜索
        remoteMethod(val) {
            this.$emit('remoteMethod', val)
        }
    }
}
</script>

<style lang="scss" scoped>
.el-table-self {
    //   margin-left: 5px;
    //   margin-right: 5px;
    .tab-svg {
        width: 24px;
        height: 24px;
        margin: 0 2px;
        cursor: pointer;
        vertical-align: middle;
    }
}
.pagination-footer {
    .description {
        float: left;
        margin-left: 20px;
        margin-top: 12px;
        font-size: 14px;
    }
    .el-pagination {
        float: right;
        margin-top: 8px;
        margin-bottom: 8px;
    }
}
.el-table__empty-block {
    position: relative;
    min-height: 60px;
    text-align: center;
    width: 100%;
    height: 100%;
}

.el-table__empty-text {
    position: absolute;
    left: 50%;
    width: 110px;
    height: 110px;
    top: 50%;
    line-height: 220px;
    -ms-transform: translate(-50%, -50%);
    transform: translate(-50%, -50%);
    color: #5e7382;
    background-position: center center;
    background-repeat: no-repeat;
    background-size: cover;
}
.tableSpan {
    display: inline-block;
    width: 100%;
    height: 100%;
    cursor: pointer;
}
.isPlan {
    font-size: 12px;
    color: #fff;
    padding: 2px 5px;
    background: #c1242a;
    border-radius: 3px;
}
.imgs {
    vertical-align: top;
}
/deep/ .default {
    th {
        background-color: #eef5fd !important;
        color: #586276;
    }
}
/deep/ .el-table__footer-wrapper tbody td {
    background: oldlace !important;
}
.el-autocomplete-suggestion.my-autocomplete {
    .desc {
        font-size: 12px;
        color: #b4b4b4;
    }
}
</style>