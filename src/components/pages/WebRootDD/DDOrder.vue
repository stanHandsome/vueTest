<template>
  <div class="content">
    <div class="topTitle">
        <span>创建个检订单</span>
        <div class="right">
            <el-select v-model="propleSearch.reportType" placeholder="订单类型">
                <el-option v-for="item in reportType" :key="item.value" :label="item.name" :value="item.value"></el-option>
            </el-select>
            <el-checkbox v-model="vipOrder">VIP</el-checkbox>
            <el-select v-model="propleSearch.reportTake"  placeholder="报告领取方式">
                <el-option v-for="item in reportTake" :key="item.value" :label="item.label" :value="item.value"></el-option>
            </el-select>
            <el-select v-model="propleSearch.reportEx" placeholder="打印类型">
                <el-option v-for="item in reportEx" :key="item.value" :label="item.label" :value="item.value"></el-option>
            </el-select>
            <el-button @click="printModal = true">打印</el-button>
            <el-button @click="peopleInfoModal = true">替检</el-button>
            <el-button @click="cancelOrder">撤回</el-button>
            <el-button type="primary" @click="submitOrder">提交</el-button>
        </div>
    </div>
    <el-row>
        <div style="flex: 0 0 320px;border-right: 1px solid #DCDFE5;display: flex;flex-direction: column;" id="resizable">
            <div class="subTitle">
                <span>客户信息</span>
                <!-- <div class="right">
                    <el-button type="primary" @click="saveCustomer('customerForm')">保存</el-button>
                </div> -->
            </div>
            <div class="peopleInfo">
                <el-form :model="customerForm" :rules="rules" ref="customerForm" label-width="70px" label-position="left">
                    <el-row :gutter="16">
                        <el-col :span="16">
                            <el-form-item label="身份证号" prop="IdcardNum">
                                <el-input v-model="customerForm.IdcardNum" maxlength="18"></el-input>
                            </el-form-item>
                            <el-form-item label="体检账号" prop="CardNum">
                                <el-input v-model="customerForm.CardNum" @keyup.enter.native="cardnumKeyup($event)"></el-input>
                            </el-form-item>
                            <el-form-item label="姓名" prop="CustomerName">
                                <el-input v-model="customerForm.CustomerName" :disabled="isSubmit"></el-input>
                            </el-form-item>
                            <el-form-item label="性别" prop="Sex" class="sexValue">
                                <el-select v-model="customerForm.Sex"  :disabled="isSubmit">
                                    <el-option label="男" value="1"></el-option>
                                    <el-option label="女" value="2"></el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8" style="text-align: center;">
                            <el-button type="primary" plain style="margin-top: 17px;width: 100%;" @click="getIdentity">刷身份证</el-button>
                            <img :src="customerForm.PhotoBase64Code" alt="" style="width: 80%;margin: 20px auto;">
                            <el-button type="text" @click="getShot" :disabled="isSubmit">拍照</el-button>
                        </el-col>
                    </el-row>

                    <el-form-item label="民族" prop="Nation">
                        <el-input v-model="customerForm.Nation" :disabled="isSubmit"></el-input>
                    </el-form-item>
                    <el-row :gutter="16">
                        <el-col :span="16">
                            <el-form-item label="出生日期" prop="Birthday">
                                <el-date-picker v-model="customerForm.Birthday" type="date" class="w100" :disabled="isSubmit"></el-date-picker>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-button-group style="margin-top: 17px; width: 100%;">
                                <el-button style="padding: 7px 18px;width: 50%;">{{age}}</el-button>
                                <el-button style="padding: 7px 18px;width: 50%;">岁</el-button>
                            </el-button-group>
                        </el-col>
                    </el-row>
                    <el-form-item label="Vip" prop="VipFlag">
                        <el-radio-group v-model="customerForm.VipFlag" :disabled="isSubmit">
                            <el-radio label="1">是</el-radio>
                            <el-radio label="0">否</el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item label="职业" prop="Occupation">
                        <el-input v-model="customerForm.Occupation" :disabled="isSubmit"></el-input>
                    </el-form-item>
                    <el-form-item label="婚姻状况" prop="MaritalStatus">
                        <el-select v-model="customerForm.MaritalStatus" :disabled="isSubmit">
                            <el-option label="未婚" value="1"></el-option>
                            <el-option label="已婚" value="2"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="手机号" prop="Tele">
                        <el-input v-model="customerForm.Tele" :disabled="isSubmit"></el-input>
                    </el-form-item>
                    <el-form-item label="地址" prop="Addr">
                        <el-input v-model="customerForm.Addr" :disabled="isSubmit"></el-input>
                    </el-form-item>
                    <el-form-item label="部门" prop="DeptName">
                        <el-input v-model="customerForm.DeptName" :disabled="isSubmit"></el-input>
                    </el-form-item>
                    <el-form-item label="班组" prop="TeamName">
                        <el-input v-model="customerForm.TeamName" :disabled="isSubmit"></el-input>
                    </el-form-item>
                    <el-form-item label="备注信息" prop="Remark">
                        <el-input type="textarea" v-model="customerForm.Remark" :disabled="isSubmit"></el-input>
                    </el-form-item>
                </el-form>
            </div>
        </div>
        <div style="flex:1;overflow: hidden;display: flex;flex-direction: column;">
            <div class="subTitle">
                <span class="subitem labelColor">订单信息</span>
                <span class="subitem">创建时间： <span class="labelColor" style="font-family: 'Arial'">2019-3-23</span></span>
            </div>
            <div class="peopleData">
                <div class="propleSearch">
                    <el-button @click="addPackageModal = true" :disabled="isSubmit">添加套餐</el-button>
                    <el-button @click="addProjectModal = true" :disabled="isSubmit">添加项目</el-button>
                    <el-button @click="delModal" :disabled="isSubmit">删除</el-button>
                    <el-button @click="discountBtn" :disabled="isSubmit">打折</el-button>
                    <div class="right">
                        <span class="subitem">项目数量： <span class="labelColor ftArial">{{ total }}</span></span>
                        <span class="subitem">合计： ￥<span class="labelColor ftArial">{{ totalPrice }}</span></span>
                        <span class="subitem">折扣： ￥<span class="labelColor ftArial">{{ (totalPrice - exePrice).toFixed(2) }}</span></span>
                        <span class="subitem" style="color: #F56C6C">项目合计： ￥<span class="ftArial">{{ exePrice }}</span></span>
                    </div>
                </div>
            </div>
            <el-table ref="multipleTable" :data="tableData3" tooltip-effect="dark" style="width: 100%" @row-click="clickRow($event, 'multipleTable')"
                @selection-change="handleSelectionChange">
                <el-table-column type="selection" width="55">
                </el-table-column>
                <el-table-column prop="itemName" label="项目名称" :show-overflow-tooltip="true">
                </el-table-column>
                <el-table-column  label="项目归属" width="100px">
										<template>
										个人
									</template>
                </el-table-column>
                <el-table-column prop="fullPrice" label="原价" sortable>
                </el-table-column>
                <el-table-column prop="discount" label="折扣" sortable>
									<template slot-scope="scope">
										{{parseInt((scope.row.realPrice ||  scope.row.exePrice)/ scope.row.fullPrice * 100)/100}}
									</template>
                </el-table-column>
                <el-table-column prop="exePrice" label="执行价格" sortable width="100px">
									<template slot-scope="scope">
										{{scope.row.realPrice ||  scope.row.exePrice}}
									</template>
                </el-table-column>
                <el-table-column prop="checkStatus" label="项目状态">
									<template slot-scope="scope">
										{{scope.row.checkStatus === 0 ? '0': '1'}}
									</template>
                </el-table-column>
            </el-table>
            <!-- 底部信息栏 -->
            <div class="fixBottom">
                <el-button type="text" @click="toggleSelection()">反选</el-button>
                <span class="subitem">合计： <span class="labelColor ftArial">{{total}}</span></span>
                <span class="subitem">选中： <span class="labelColor ftArial">{{selectedTotal}}</span></span>
            </div>
            <!-- 弹窗块 -->
            <el-dialog title="添加套餐" :visible.sync="addPackageModal" :close-on-click-modal="false" width="90%" @open="getPackageList">
								<div class="modal-tree">
									<div class="modal-top">名称</div>
									<div class="modal-con">
										<el-tree
											:data="addPackageData"
											show-checkbox
											default-expand-all
											node-key="id"
											ref="tree"
											>
										</el-tree>
									</div>
								</div>
                <div slot="footer" class="dialog-footer">
                    <el-button @click="addPackageModal = false">取 消</el-button>
                    <el-button type="primary" @click="addPackageModal = false">确 定</el-button>
                </div>
            </el-dialog>
						<el-dialog title="添加项目" :visible.sync="addProjectModal" :close-on-click-modal="false" width="90%" @open="getPackageAll">
							<div class="addProject">
								<div class="project-left">
									<el-tabs v-model="activeTabName" type="card" @tab-click="tabsClick" class="addTabs">
										<el-tab-pane label="按套餐添加" name="first">
											<div class="modal-tree" style="border-top: none;">
												<div class="modal-top">
													<span>名称</span>
													<el-input placeholder="请搜索" v-model="filterPackage" style="width: 150px;"></el-input>
													<div class="right" style="margin-right: 8px">
														<el-button @click="addBtn">添加</el-button>
													</div>
												</div>
												<div class="modal-con">
													<el-tree
														:data="GetPackageList"
														show-checkbox
														node-key="id"
														ref="first"
														:filter-node-method="filtertree"
														>
													</el-tree>
												</div>
											</div>
										</el-tab-pane>
										<el-tab-pane label="按科室添加" name="second">
											<div class="modal-tree" style="border-top: none;">
												<div class="modal-top">
													<span>名称</span>
													<el-input placeholder="请搜索" v-model="filterDept" style="width: 150px;"></el-input>
													<div class="right" style="margin-right: 8px">
														<el-button @click="addBtn">添加</el-button>
													</div>
												</div>
												<div class="modal-con">
													<el-tree
														:data="GetDeptList"
														show-checkbox
														ref="second"
														node-key="id"
														:filter-node-method="filtertree"
														>
													</el-tree>
												</div>
											</div>
										</el-tab-pane>
										<el-tab-pane label="按项目添加" name="third">
											<div class="modal-tree" style="border-top: none;">
												<div class="modal-top">
													<span>名称</span>
													<el-input placeholder="请搜索" v-model="filterProject" style="width: 150px;"></el-input>
													<div class="right" style="margin-right: 8px">
														<el-button @click="addBtn">添加</el-button>
													</div>
												</div>
												<div class="modal-con">
													<el-tree
														:data="GetItemList"
														show-checkbox
														node-key="id"
														ref="third"
														:filter-node-method="filtertree"
														>
													</el-tree>
												</div>
											</div>
										</el-tab-pane>
									</el-tabs>
								</div>
								<div class="project-right">
									<div class="modal-tree" style="margin-top: 40px;">
										<div class="modal-top">
											<span>名称</span>
											<div class="right" style="margin-right: 8px">
												<el-button @click="removeBtn">移除</el-button>
											</div>
										</div>
										<div class="modal-con">
											<el-tree
												:data="selectedListAll"
												show-checkbox
												:default-expanded-keys="[1]"
												node-key="id"
												ref="treeRight"
												>
											</el-tree>
										</div>
									</div>
								</div>
							</div>
							<div slot="footer" class="dialog-footer">
								<el-button @click="cancelBtn">取 消</el-button>
								<el-button type="primary" @click="confirmAddProjectBtn">确 定</el-button>
							</div>
            </el-dialog>
            <el-dialog title="订单信息" :visible.sync="orderInfoModal" :close-on-click-modal="false" width="90%">
                <div class="modal-title">
									<span>订单信息</span>
									<div class="right">
										<el-button type="primary" style="">创建新订单</el-button>
									</div>
								</div>
                <el-table
                    :data="orderList"
                    border
                    style="width: 100%;margin-top: 20px;">
                    <el-table-column
                    prop="cardNum"
                    label="体检卡号"
                    >
                    </el-table-column>
                    <el-table-column
                    prop="idcardNum"
										width="180px"
                    label="身份证号"
                    >
                    </el-table-column>
                    <el-table-column
                    prop="unitName"
                    label="单位名称"
                    >
                    </el-table-column>
                    <el-table-column
                    prop="orderMoney"
                    label="体检金额"
                    >
                    </el-table-column>
                    <el-table-column
                    prop="createOrderTime"
                    label="创建时间"
                    >
											<template slot-scope="scope">
												{{scope.row.createOrderTime | formatDate('YYYY-MM-DD')}}
											</template>
                    </el-table-column>
                    <el-table-column
                    prop="orderStatus"
                    label="订单状态"
                    >
                    </el-table-column>
                    <el-table-column
                    fixed="right"
                    label="操作"
                    width="100">
                    <template slot-scope="scope">
                        <el-button type="text" v-if="scope.row" @click="viewOrder(scope.row)">查看</el-button>
                        <el-button type="text">编辑</el-button>
                    </template>
                    </el-table-column>
                </el-table>
            </el-dialog>
            <el-dialog title="客户信息" :visible.sync="peopleInfoModal" width="90%" :close-on-click-modal="false" class="peopleInfoForm">
                <el-form :model="peopleInfo" :rules="rules" ref="peopleForm" :inline="true" label-width="50px">
                    <el-form-item label="身份证号" prop="IdcardNum" :label-width="formLabelWidth">
                        <el-input v-model="peopleInfo.IdcardNum" autocomplete="off" style="width: 130px;margin-right: 8px;"></el-input>
												<el-button type="primary" plain style="" @click="getIdentity">刷身份证</el-button>
                    </el-form-item>
                    <el-form-item label="体检卡号" prop="CardNum" :label-width="formLabelWidth">
                        <el-input v-model="peopleInfo.CardNum" autocomplete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="姓名" prop="CustomerName" :label-width="formLabelWidth">
                        <el-input v-model="peopleInfo.CustomerName" autocomplete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="性别" prop="Sex" :label-width="formLabelWidth">
                        <el-select v-model="peopleInfo.Sex" style="width: 100%">
                            <el-option label="男" value="1"></el-option>
                            <el-option label="女" value="0"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="民族" prop="Nation" :label-width="formLabelWidth">
                        <el-select v-model="peopleInfo.Nation">
                            <el-option label="男" value="1"></el-option>
                            <el-option label="女" value="0"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="出生日期" prop="Birthday" :label-width="formLabelWidth">
                        <el-date-picker v-model="peopleInfo.Birthday" type="date" style="width: 143px;margin-right: 8px;"></el-date-picker>
                        <el-button-group>
                            <el-button style="padding: 7px 10px;width: 50%;">41</el-button>
                            <el-button style="padding: 7px 10px;width: 50%;">岁</el-button>
                        </el-button-group>
                    </el-form-item>
                    <el-form-item label="职业" prop="Occupation" :label-width="formLabelWidth">
                        <el-select v-model="peopleInfo.Occupation">
                            <el-option label="男" value="1"></el-option>
                            <el-option label="女" value="0"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="婚姻状况" prop="MaritalStatus" :label-width="formLabelWidth">
                        <el-select v-model="peopleInfo.MaritalStatus">
                            <el-option label="男" value="1"></el-option>
                            <el-option label="女" value="0"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="手机号" prop="Tele" :label-width="formLabelWidth">
                        <el-input v-model="peopleInfo.Tele" autocomplete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="部门" prop="DeptName" :label-width="formLabelWidth">
                        <el-input v-model="peopleInfo.DeptName" autocomplete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="班组" prop="TeamName" :label-width="formLabelWidth">
                        <el-input v-model="peopleInfo.TeamName" autocomplete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="Vip" prop="VipFlag" :label-width="formLabelWidth">
                        <el-radio-group v-model="peopleInfo.VipFlag">
                            <el-radio label="1">是</el-radio>
                            <el-radio label="0">否</el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item label="地址" prop="Addr" class="w100" :label-width="formLabelWidth">
                        <el-input v-model="peopleInfo.Addr"></el-input>
                    </el-form-item>
                    <el-form-item label="备注信息" prop="Remark" class="w100" :label-width="formLabelWidth">
                        <el-input type="textarea" v-model="peopleInfo.Remark"></el-input>
                    </el-form-item>
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button @click="peopleInfoModal = false">取消</el-button>
                    <el-button type="primary" @click="tjOrder">确定</el-button>
                </div>
            </el-dialog>
            <el-dialog title="当前客户订单" :visible.sync="currentOrderModal" width="90%" :close-on-click-modal="false" class="currentOrder">
                <div class="modal-title">客户信息</div>
                <div class="modal-con">
                    <ul>
                        <li>
                            姓名： <span>{{viewData.customerName}}</span>
                        </li>
                        <li>
                            性别： <span>{{viewData.sex === 1 ? '男' : '女'}}</span>
                        </li>
                        <li>
                            职业： <span>{{viewData.deptName}}</span>
                        </li>
                        <li>
                            手机号： <span>{{viewData.tele}}</span>
                        </li>
                        <li>
                            出生日期： <span>{{viewData.birthday | formatDate('YYYY-MM-DD')}}</span>
                        </li>
                        <li>
                            婚姻状况： <span>{{viewData.deptName}}</span>
                        </li>
                        <li>
                            民族： <span>{{viewData.nation}}</span>
                        </li>
                    </ul>
                </div>
                <div class="modal-title">检查项目</div>
                <div class="modal-con">
                    <el-table
                        :data="viewData.items"
                        border
                        style="width: 100%">
                        <el-table-column
                        prop="itemName"
                        label="检查项目"
                        >
                        </el-table-column>
                        <el-table-column
                        prop="name"
                        label="项目归属"
                        >
                        </el-table-column>
                        <el-table-column
                        prop="fullPrice"
                        label="原价"
                        >
                        </el-table-column>
                        <el-table-column
                        prop="city"
                        label="折扣"
                        >
													<template slot-scope="scope">
														{{scope.row.exePrice / scope.row.fullPrice}}
													</template>
                        </el-table-column>
                        <el-table-column
                        prop="exePrice"
                        label="执行价格"
                        >
                        </el-table-column>
                        <el-table-column
                        prop="checkStatus"
                        label="项目状态"
                        >
                        </el-table-column>
                    </el-table>
                </div>
            </el-dialog>
						<el-dialog title="打印信息" :visible.sync="printModal" width="90%" :close-on-click-modal="false" class="currentOrder">
							<div class="modal-title">
								<span>打印姓名条码</span>
								<div class="right">
									打印数量:
									<div class="numberTol">
										<span class="el-icon-remove-outline" @click="--value"></span>
										<el-input placeholder="请输入内容" v-model.number="value"></el-input>
										<span class="el-icon-circle-plus-outline" @click="++value"></span>
									</div>
									 <el-select v-model="value" placeholder="请选择">
										<el-option
											v-for="item in options"
											:key="item.value"
											:label="item.label"
											:value="item.value">
										</el-option>
									</el-select>
								</div>
							</div>
							<div class="modal-title">
								<span>打印检验条码</span>
								<div class="right">
									<el-select v-model="value" placeholder="请选择" style="width: 90px;margin-right: 8px;">
										<el-option
											v-for="item in options"
											:key="item.value"
											:label="item.label"
											:value="item.value">
										</el-option>
									</el-select>
									<el-button>查询</el-button>
									 <el-select v-model="value" placeholder="请选择" style="margin-left: 16px;">
										<el-option
											v-for="item in options"
											:key="item.value"
											:label="item.label"
											:value="item.value">
										</el-option>
									</el-select>
								</div>
							</div>
							<div class="modal-con">
								<el-table
									:data="tableData3"
									border
									style="width: 100%">
									<el-table-column
									fixed
									prop="date"
									label="替检卡号"
									>
									</el-table-column>
									<el-table-column
									prop="name"
									label="身份证号"
									>
									</el-table-column>
									<el-table-column
									prop=""
									label="单位名称"
									>
									</el-table-column>
									<el-table-column
									prop="city"
									label="体检金额"
									>
									</el-table-column>
									<el-table-column
									prop="address"
									label="创建时间"
									>
									</el-table-column>
									<el-table-column
									prop="zip"
									label="订单状态"
									>
									</el-table-column>
									<el-table-column
									fixed="right"
									label="操作"
									width="100">
									<template slot-scope="scope">
										<el-button type="text" v-if="scope.row">查看</el-button>
										<el-button type="text">编辑</el-button>
									</template>
									</el-table-column>
								</el-table>
							</div>
							<div slot="footer" class="dialog-footer">
								<el-button @click="discountModal = false">取 消</el-button>
								<el-button type="primary" @click="discountModal = false">确 定</el-button>
							</div>
						</el-dialog>
            <el-dialog title="打折" :visible.sync="discountModal" :close-on-click-modal="false" width="80%" class="discount">
                <ul class="modal-con">
                    <li class="item">
                        <span>合计金额：</span>
                        <div class="item-list" ><el-input v-model="discountData.total" disabled style="color: #606266;"></el-input>元</div>
                    </li>
                    <li class="item">
                        <span>折扣：</span>
                        <div class="item-list"><el-input v-model="discountData.discount" @keydown.13.native="discountHandle"></el-input></div>
                    </li>
                    <li class="item">
                        <span>折扣金额：</span>
                        <div class="item-list" ><el-input v-model="discountData.difPrice" @keydown.13.native="difPriceHandle"></el-input>元</div>
                    </li>
                    <li class="item">
                        <span>实收：</span>
                        <div class="item-list"><el-input v-model="discountData.exePrice" @keydown.13.native="realPriceHandle"></el-input>元</div>
                    </li>
                </ul>
                <div slot="footer" class="dialog-footer">
                    <el-button @click="discountModal = false">取 消</el-button>
                    <el-button type="primary" @click="confirmDiscount">确 定</el-button>
                </div>
            </el-dialog>
        </div>
    </el-row>
  </div>
</template>

<script>
import moment from 'moment'
import _ from 'lodash'
export default {
  name: 'DDOrder',
	data() {
		return {
			isSubmit: true,// 是否允许提交
			isDisCount: false, // 是否允许打折窗口点击确定
			selectedTotal: 0, // 选中条数
			isMoreOrder: false, // 是否允许多条订单

			// 弹窗控制变量
			addPackageModal: false,
			addProjectModal: false,
			printModal: false,
			orderInfoModal: false,
			peopleInfoModal: false,
			currentOrderModal: false,
			discountModal: false,
			// tree - 筛选字段
			filterPackage: '',
			filterDept: '',
			filterProject: '',

			vipOrder: false,
			orderList: [], // 订单信息的返回list
			formLabelWidth: '70px',
			customerForm: { // 客户信息
					CustomerCode:'00000000-0000-0000-0000-000000000000',
					CardNum: '',
					CustomerName: '',
					Sex: '1',
					PhotoBase64Code: 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1554184104786&di=b2dd79b5141ea93dab0547024e0f4102&imgtype=0&src=http%3A%2F%2Fpic4.zhimg.com%2Fv2-d552a58b9ce4d12ef0dc74fd34dd3c07_b.jpg',
					Nation: '',
					IdcardNum: '',
					Birthday: '',
					MaritalStatus:'',
					VipFlag: '0',
					Occupation: '',
					UnitName: '',
					DeptName: '',
					TeamName:'',
					Tele: '',
					Addr:'',
					Remark: ''
			},
			peopleInfo: { // 替检客户信息
					CustomerCode:'00000000-0000-0000-0000-000000000000',
					CardNum: '',
					CustomerName: '',
					Sex: '1',
					PhotoBase64Code: 'https://ss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=2161523157,1298941018&fm=26&gp=0.jpg',
					Nation: '',
					IdcardNum: '',
					Birthday: '',
					MaritalStatus:'',
					VipFlag: '0',
					Occupation: '',
					UnitName: '',
					DeptName: '',
					TeamName:'',
					Tele: '',
					Addr:'',
					Remark: ''
			},
			age: '0', // 年龄
			rules: {
					CardNum: [
							{ required: true, message: '请输入体检账号', trigger: 'blur' }
					],
					CustomerName: [
							{ required: true, message: '请输入姓名', trigger: 'blur' }
					],
					Sex: [
							{  required: true, message: '请输入性别', trigger: 'blur' }
					],
					Nation: [
							{ required: false, message: '请输入民族', trigger: 'blur' }
					],
					IdcardNum: [
							{ required: true, message: '请输入身份证号码', trigger: 'blur' }
					],
					Birthday: [
							{ type: 'date', required: true, message: '请选择时间', trigger: 'change' }
					],
					VipFlag: [
							{  required: true, message: '请选择Vip属性', trigger: 'blur' }
					],
					Tele: [
							{ required: true, message: '请输入联系电话', trigger: 'blur' }
					]
			},
			reportType: [], // 订单类型
			reportTake: [ // 报告领取方式
					{
							value: '0',
							label: '自取'
					},
					{
							value: '1',
							label: '快递'
					},
					{
							value: '2',
							label: '线上'
					}
			],
			reportEx: [
					{
							value: '0',
							label: '姓名'
					},
					{
							value: '1',
							label: '导检单'
					},
					{
							value: '2',
							label: '检验条码'
					}
			],
			propleSearch: {
					reportType: 0,
					reportTake: '',
					reportEx: ''
			},
			GetItemList: [], // 检查项目字典源
			GetDeptList: [], // 检查科室字典源
			GetPackageList: [], // 检查套餐字典源

			selectedLeft: [],// 左侧所选择的
			selectedRight: [],// 右侧所选择的

			selectedListAll: [],// 右侧展示的树
			viewData: {}, // 查看当前订单data
			addPackageData: [], // 添加套餐数据源
			discountData: {
				total: 0,
				exePrice: 0,
				discount: 0,
				discount2: 0,
				difPrice: 0,
			},

			tableData3: [],
			multipleSelection: [],
			value: '',
			activeTabName: 'first',//默认
			options: [
				{label: '1', value: '1'},
				{label: '2', value: '2'},
				{label: '3', value: '3'}
			]
		}
	},
	created: function () {
		this.GetOrderType();
	},
	methods: {
		//改变是否可编辑flag
		toggleisSubmit(){
			this.isSubmit = false;
		},
		//替检 客户信息 点击确定
		tjOrder(){
			this.peopleInfoModal = false;
			this.customerForm = this.peopleInfo;
		},
		submitOrder() {//提交订单
			if (!this.customerForm.CustomerName || !this.customerForm.Sex || !this.customerForm.Birthday || !this.customerForm.Tele) {
				this.$message.error('请先填写完整的客户信息');
				return;
			}
			let params = {
				operator: '001',
				order: this.customerForm
			}
			if (this.tableData3.length === 0) {
				this.$message.error('请添加项目后提交');
				return;
			}
			params.order.items = this.tableData3;

			let loading = this.$loading({
          lock: true,
          text: '提交订单中，请稍后...',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)'
        });
			this.$axios.post(this.$api.SubmitOrder, params).then(res => {
				if (res.data.status === 1 && res.data.entity) {
					console.log(res)
					this.$message.success('订单创建成功');
					loading.close();
					// window.location.reload();
				}
			}).catch(err => {
				this.$message.error(err.data.message);
				loading.close();
			})
		},
		//撤销订单
		cancelOrder(){
			this.$axios.post(this.$api.CancelSubmitOrder,{
				orderCode: '1'
			}).then(res => {
				if (res.data.status === 1) {
					this.$message.success('订单撤销成功');
				}
			}).catch(err => {
				this.$message.success(err.data.message);
			})
		},
		//打折按钮
		discountBtn(){
			if (this.multipleSelection.length === 0 ) {
				this.$message({
					type: 'error',
					message: '请至少选择一项进行打折'
				});
				return;
			}
			this.discountData.total = 0;
			this.discountData.exePrice = 0;
			this.multipleSelection.forEach(x => {
				this.discountData.total += x.fullPrice;
				this.discountData.exePrice += (Number(x.exePrice) || Number(x.realPrice));
			})
			this.discountData.discount = parseInt(this.discountData.exePrice / this.discountData.total * 100) / 100;
			this.discountData.discount2 = this.discountData.exePrice / this.discountData.total;
			this.discountData.difPrice = (this.discountData.total - this.discountData.exePrice).toFixed(2);
			this.discountModal = true;
		},
		// 打折框-确定
		confirmDiscount(){
			if (!this.isDisCount && !(this.discountData.exePrice / this.discountData.total == this.discountData.discount2)) {
				this.$message.error('请先输入正确的折扣');
				return;
			}
			this.multipleSelection.forEach(x => {
				this.tableData3.forEach((y, index) => {
					if (x.id === y.id) {
						if (y.exePrice) {
							let newobj = y;
							newobj.exePrice = (y.fullPrice * this.discountData.discount2).toFixed(2);
							this.$set(this.tableData3,index,newobj)
						}
					}
				})
			})
			this.cancelSelected();
			this.discountModal = false;
		},
		//树的筛选
		filtertree(value, data) {
			if (!value) return true;
			return data.label.indexOf(value) !== -1;
		},
		// tree单选的实现
		treeClick(a,b){
			if (b.checkedKeys.length > 0) {
				this.$refs.tree.setCheckedKeys([a.id]);
			}
		},
		// 添加项目-取消
		cancelBtn(){
			this.addProjectModal = false;
			this.selectedLeft = [];
			this.selectedRight = [];
			this.selectedListAll = [];
			this.$refs.first.setCheckedKeys([]);
			this.$refs.second.setCheckedKeys([]);
			this.$refs.third.setCheckedKeys([]);
		},
		//添加项目添加按钮
		addBtn() {
			if (this.$refs[this.activeTabName].getCheckedNodes().length === 0) {
				this.$message.error('请先选择后点击添加！');
				return;
			}
			let arr = this.$refs[this.activeTabName].getCheckedNodes().filter(x => {
				return !(x.children);
			})
			arr = this.selectedListAll.concat(arr);
			this.selectedListAll = _.uniqBy(arr, 'id');
			this.$refs[this.activeTabName].setCheckedKeys([]);
		},
		//添加项目删除按钮
		removeBtn() {
			if (this.$refs.treeRight.getCheckedKeys().length === 0) {
				this.$message.error('请先选择后点击删除！');
				return;
			}
			let arr = this.$refs.treeRight.getCheckedKeys();
			this.selectedListAll = this.selectedListAll.filter(x => {
				return arr.every(y => y!== x.id);
			})
			this.selectedRight = [];
		},
		// 添加项目切换tab时fn
		tabsClick(tab){
			this.selectedLeft = [];
			this.$refs.first.setCheckedKeys([]);
			this.$refs.second.setCheckedKeys([]);
			this.$refs.third.setCheckedKeys([]);
			if (tab.name === 'second' && this.GetDeptList.length === 0) {
				this.getDeptList();
			}
			if (tab.name === 'third' && this.GetItemList.length === 0) {
				this.getDicItemList();
			}
		},
		// 项目删除的选择fn
		removeChange(data, checked, indeterminate) {
			if (checked) {
				this.selectedRight.push(data);
			} else {
				this.selectedRight = this.selectedRight.filter(x => {
					return x.id != data.id;
				})
			}
		},
		//获取订单类型
		GetOrderType() {
			this.$axios.get(this.$api.GetOrderType).then(res => {
				if (res.status === 200 && res.data.status === 1) {
					this.reportType = res.data.entity;
				}
			})
		},
		//获取订单列表
		getOrderList(){
			this.$axios.get(this.$api.GetOrderList, {
				params: {IdCardNum: this.customerForm.IdcardNum}
			}).then(res => {
				if (res.status === 200 && res.data.status === 1) {
					if (this.isMoreOrder) {
						this.orderInfoModal = true;
						this.orderList = res.data.entity;
					} else {
							this.tableData3 = res.data.entity[0].items;
					}
				} else {
					this.$message({
						type: 'error',
						message: err.data.message
					});
				}
			}).catch(err => {
				this.$message({
					type: 'error',
					message: err.data.message
				});
			})
		},
		//查询客户信息
		getCustomer(key){
			this.$axios.get(this.$api.GetCustomer, {
				params: {
					IdcardNum: this.customerForm.IdcardNum
				}
			}).then(res => {
				if (res.data.entity && res.data.status === 1) {
					let obj = res.data.entity;
					this[key].CustomerName = obj.customerName;
					this[key].Sex = obj.sex;
					if (obj.PhotoBase64Code) this[key].PhotoBase64Code = obj.imgSrc;
					this[key].Nation = obj.nation;
					this[key].Birthday = moment(obj.birthday);
					this[key].MaritalStatus = obj.maritalStatus;
					this[key].VipFlag = obj.vipFlag;
					this[key].Occupation = obj.occupation;
					this[key].UnitName = obj.unitName;
					// this.customerForm.DeptName = obj.DeptName;
					this[key].TeamName = obj.teamName;
					this[key].Tele = obj.tele;
					this[key].Addr = obj.addr;
					this[key].Remark = obj.remark;
				} else {
					this.$message({
						type: 'error',
						message: res.data.message
					});
				}
			}).catch(err => {
				this.$message({
					type: 'error',
					message: err.data.message
				});
			})
		},
		//获取套餐列表
		getPackageList(){
			this.$axios.get(this.$api.GetPackageList, {
				params: {
					PackageType: this.propleSearch.reportType, // 0 普通套餐 =1 筛查套餐
					SexType: this.customerForm.Sex, // 1男2女
					FilterType: '0', // 0 普通套餐 =1 疾病 = 2部位
					IncludeItems: true // 是否包含项目列表
				}
			}).then(res => {
				if (res.status === 200 && res.data.status === 1) {
					this.addPackageData = res.data.entity;
				} else {
					this.$message({
						type: 'error',
						message: err.data.message
					});
				}
			}).catch(err => {
				this.$message({
					type: 'error',
					message: err.data.message
				});
			})
		},
		//获取套餐项目列表
		getPackageItemList(){
			this.$axios.get(this.$api.GetPackageItemList, {
				params: {
					PackageCode: this.customerForm.IdcardNum
				}
			}).then(res => {
				if (res.status === 200 && res.data.status === 1) {
					// this.orderList = res.data.entity;
					// console.log(res)
				} else {
					this.$message({
						type: 'error',
						message: err.data.message
					});
				}
			}).catch(err => {
				this.$message({
					type: 'error',
					message: err.data.message
				});
			})
		},
		//获取检查项目字典
		getDicItemList(){
			this.$axios.get(this.$api.GetItemList).then(res => {
				if (res.status === 200 && res.data.status === 1) {
					this.GetItemList =  res.data.entity;
					this.handleTreeChildren(this.GetItemList, 3);
				} else {
					this.$message({
						type: 'error',
						message: err.data.message
					});
				}
			}).catch(err => {
				this.$message({
					type: 'error',
					message: err.data.message
				});
			})
		},
		//获取科室字典
		getDeptList(){
			this.$axios.get(this.$api.GetDeptList).then(res => {
				if (res.status === 200 && res.data.status === 1) {
					this.GetDeptList =  res.data.entity;
					this.handleTreeChildren(this.GetDeptList, 2);
				} else {
					this.$message({
						type: 'error',
						message: err.data.message
					});
				}
			}).catch(err => {
				this.$message({
					type: 'error',
					message: err.data.message
				});
			})
		},
		// 添加项目-确定
		confirmAddProjectBtn(){
			this.addProjectModal = false;
			let arr = this.tableData3.concat(this.selectedListAll);
			this.tableData3 = _.uniqBy(arr, 'id');
			this.cancelBtn();
		},
		//获取套餐字典
		getPackageAll(){
			this.$axios.get(this.$api.GetPackageList).then(res => {
				if (res.status === 200 && res.data.status === 1) {
					this.GetPackageList = res.data.entity;
					this.handleTreeChildren(this.GetPackageList, 1);
				} else {
					this.$message({
						type: 'error',
						message: err.data.message
					});
				}
			}).catch(err => {
				this.$message({
					type: 'error',
					message: err.data.message
				});
			})
		},
		// 处理字典tree结构
		handleTreeChildren(data, type){
			data.map(i => {
				i.id = (i.packageCode || i.itemCode || i.deptCode)
				i.label = (i.packageName || i.itemName || i.deptName)
				i.type = type
				if (i.items && i.items.length > 0) {
					i.children = i.items;
					this.handleTreeChildren(i.children, type);
				}
			})
		},
		viewOrder(data){
			// console.log(data)
			this.viewData = data;
			this.currentOrderModal = true;

		},
		// 体检账号回车操作
		cardnumKeyup(ev){
			if(ev.keyCode == 13){
				let that = this;
				this.$axios
					.get(this.$api.GetCustomerURL, {
						params: {
							CardNum: this.customerForm.CardNum,
						}
					})
					.then(function(response) {
						if (response.data.status === 1) {
							that.setCustomer(response.data.entity);
						} else {
							that.$message.error(response.data.message);
							that.customerForm.CardNum ="";
						}
					})
					.catch(function(error) {
						console.log(error);
					});
			}
		},
		setCustomer(customer){
			this.customerForm.CustomerCode=customer.customerCode;
			this.customerForm.CustomerName = customer.customerName;
			this.customerForm.IdcardNum=customer.idcardNum
			this.customerForm.Sex = customer.sex;
			this.customerForm.Birthday = customer.birthday;
			this.customerForm.Nation = customer.Nation;
		},
		setIdentity(result) {
			//console.log(result);
			let id = JSON.parse(result);
			this.customerForm.CustomerName = id.Name;
			this.customerForm.Sex = id.Sex;
			this.customerForm.Birthday = id.Birthday;
			this.customerForm.Nation = id.Nation;
			this.customerForm.IdcardNum = id.IdcardNumNum;
			this.customerForm.PhotoBase64Code = 'data: image/bmp; base64,' + id.PicBase64Code;
		},
		getIdentity () {
			api.getIdcard(this.setIdentity);
		},
		setPhoto(picBase64Code) {
			this.customerForm.PhotoBase64Code = 'data: image/bmp; base64,' + picBase64Code;
		},
		getShot () {
			api.shot(this.setPhoto);
		},
		// 保存用户信息
		saveCustomer(formName) {//customerForm
			this.$refs[formName].validate((valid) => {
				if (valid) {
					this.$axios.post(this.$api.SaveCustomerURL, this.customerForm).then(res => {
						res.Message;
					}).catch(error => {

					});
				} else {
					// console.log('error submit!!');
						return false;
				}
			});
		},
		// 是否可以跳转标记
		changeIsGoto() {
			this.$store.commit('changeGoto');
		},
		// 反选
		toggleSelection() {
			if (this.tableData3) {
				this.tableData3.forEach(row => {
					this.$refs.multipleTable.toggleRowSelection(row);
				});
			} else {
				this.$refs.multipleTable.clearSelection();
			}
		},
		// 取消选择
		cancelSelected(){
			this.$refs.multipleTable.clearSelection();
		},
		handleSelectionChange(val) {
			this.multipleSelection = val;
		},
		// 删除按钮
		delModal() {
			if (this.multipleSelection.length === 0 ) {
				this.$message({
					type: 'error',
					message: '请至少选择一项进行删除'
				});
				return;
			}
			this.$confirm('此操作将删除所选项目, 是否继续?', '提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning'
			}).then(() => {
				this.tableData3 = this.tableData3.filter(x => {
					return this.multipleSelection.every(y => y.itemCode !== x.itemCode)
				})
				this.$message({
					type: 'success',
					message: '删除成功!'
				});
			}).catch(() => {
				this.$message({
					type: 'info',
					message: '已取消删除'
				});
			});
		},
		handleCurrentChange(val) {
			this.pageIndex = val;
		},
		//按回车后对打折进行处理
		discountHandle() {
			if (typeof this.discountData.discount === 'number'){
				 this.$message.error('请输入不大于零的折扣数字');
			}
			this.discountData.exePrice = (this.discountData.total * this.discountData.discount).toFixed(2);
			this.discountData.difPrice = (this.discountData.total - this.discountData.exePrice).toFixed(2);
			this.discountData.discount2 = this.discountData.discount;
			if (this.discountData.discount2 > 0.1 && this.discountData.discount2 <= 1) {
				this.isDisCount = true;
			} else {
				this.$message.error('请输入正确的折扣')
			}
		},
		difPriceHandle() {
			if (typeof this.discountData.difPrice === 'number'){
				 this.$message.error('请输入大于零的数字');
			}
			this.discountData.difPrice= Number(this.discountData.difPrice);
			this.discountData.exePrice = (this.discountData.total - this.discountData.difPrice).toFixed(2);
			this.discountData.discount = parseInt(this.discountData.exePrice / this.discountData.total * 100) / 100;
			this.discountData.discount2 = this.discountData.exePrice / this.discountData.total;
			if (this.discountData.discount2 > 0.1 && this.discountData.discount2 <= 1) {
				this.isDisCount = true;
			} else {
				this.$message.error('请输入正确的折扣')
			}
		},
		realPriceHandle() {
			if (typeof this.discountData.exePrice === 'number'){
				 this.$message.error('请输入大于零的数字');
			}
			this.discountData.exePrice= Number(this.discountData.exePrice);
			this.discountData.discount = parseInt(this.discountData.exePrice / this.discountData.total * 100) / 100;
			this.discountData.discount2 =this.discountData.exePrice / this.discountData.total;
			this.discountData.difPrice = (this.discountData.total - this.discountData.exePrice).toFixed(2);
			if (this.discountData.discount2 > 0.1 && this.discountData.discount2 <= 1) {
				this.isDisCount = true;
			} else {
				this.$message.error('请输入正确的折扣')
			}
		},
	},
	computed: {
		//项目列表变化时总价 数量 实收世事变化
		totalPrice: function(){
			let price = 0;
			this.tableData3.forEach(x => {
				price += x.fullPrice;
			})
			return price;
		},
		exePrice:  function(){
			let price = 0;
			this.tableData3.forEach(x => {
				price += Number(x.exePrice);
			})
			return price;
		},
		total: function(){
			return this.tableData3.length;
		}
	},
	watch: {
		'customerForm.IdcardNum': function(val, oldVal) {
			if (val !== oldVal && val.length === 18) {
				this.toggleisSubmit();
				this.getOrderList();
				this.getCustomer('customerForm');
			}
		},
		'customerForm.VipFlag': function(val, oldVal) {
			if (val !== oldVal) {
				this.vipOrder = val === '0' ? false : true;
			}
		},
		'customerForm.Birthday': function(val, oldVal) {
			if (val !== oldVal) {
				this.age = moment().year() - moment(val).year();
			}
		},
		'peopleInfo.IdcardNum': function(val, oldVal) {
			if (val !== oldVal && val.length === 18) {
				this.getCustomer('peopleInfo');
			}
		},
		filterPackage(val) {
			this.$refs.first.filter(val);
		},
		filterDept(val) {
			this.$refs.second.filter(val);
		},
		filterProject(val) {
			this.$refs.third.filter(val);
		},
		multipleSelection: function(val, oldVal) {
			if(val != oldVal) {
				this.selectedTotal = val.length;
			}
		},
	}
}
</script>
<style>
.content .right > * {
    display: inline-block;
}
.content .right .el-select {
    width: 120px;
}
.content .right .el-checkbox {
    margin-right: 16px;
}
.content .right .el-select {
    margin-right: 16px;
}
.content .el-select{
    width: 178px;
}
.content .sexValue .el-select {
	width: 100%;
}
.content .peopleInfoForm .w100 .el-form-item__content{
    width: 90%;
}
.content  .peopleInfoForm .el-form-item__content , .content  .peopleInfoForm .el-form-item__content .el-select{
    width: 220px;
}
.content .el-form--inline .el-form-item {
    margin-right: 20px;
    margin-top: 24px;
}
.content .currentOrder ul {
    overflow: hidden;
}
.content .currentOrder li {
    width: 25%;
    float: left;
    line-height: 32px;
}
.content .discount .el-input {
    width: 150px;
    padding-right: 8px;
}
.modal-tree {
	border: 1px solid #DCDFE5;
	border-radius: 5px;
}
.modal-tree .modal-top {
	height: 40px;
	line-height: 40px;
	text-indent: 16px;
	border-bottom: 1px solid #DCDFE5;
}
.modal-tree  .modal-con {
		padding: 16px;
		height: 400px;
		overflow-y: auto;
}
/* .project-right .el-checkbox, .modal-tree .el-tree-node__children .el-checkbox {
	display: none;
} */
.addProject{
	overflow: hidden;
}
.addProject .project-left{
	width: 49%;
	float: left;
}
.addProject .project-right {
	width: 49%;
	float: right;
}
.addTabs .el-input__inner {
	border-radius: 20px;
}
.addTabs .el-tabs__nav-scroll {
	padding-left: 0;
}
.numberTol {
	border: 1px solid #DCDFE5;
	border-radius: 5px;
	margin-right: 16px;
}
.numberTol span{
	line-height: 26px;
	padding: 0 15px;
	vertical-align: bottom;
	cursor: pointer;
}
.numberTol .el-input {
	display: inline-block;
	width: 50px;
}
.numberTol .el-input .el-input__inner {
	padding: 0 8px;
	border-radius: 0;
	border: none;
	border-right: 1px solid #DCDFE5;
	border-left: 1px solid #DCDFE5;
	vertical-align: baseline;
	text-align: center;
}
</style>
