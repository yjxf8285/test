<template>
  <div class="single-transaction">
    <top-bar title="事务" :showBack="true" @barChange="topbarChange"></top-bar>
    <!--<FilterBarComplex v-if="filterListData.length>0" :filterList="filterListData" style="margin-top: -10px"-->
    <!--@fbarChange="filterbarChange"></FilterBarComplex>-->


    <el-tabs class="tabs-transaction" @tab-click="tabClick">
      <el-tab-pane label="图表分析">
        <div class="graph-content">
          <div class="common-container">
            <div class="content">
              <div class="row-first">
                <div class="l">
                  <div class="list-wrap">
                    <ul>
                      <li>
                        <div class="hd"><i class="icon ion-gear-a"></i>
                          <span>代码执行时间：{{performanceSummariesData.avgCodeTime}} ms</span>
                        </div>
                        <el-progress :show-text="false"
                                     :percentage="performanceSummariesData.percentArr[0]"></el-progress>
                      </li>
                      <li>
                        <div class="hd"><i class="icon ion-soup-can"></i>
                          <span
                            v-if="performanceSummariesData.avgDBTime>0">数据库调用时间：{{performanceSummariesData.avgDBTime}} ms</span>
                          <span v-else>无数据库调用时间</span>
                        </div>
                        <el-progress :show-text="false"
                                     :percentage="performanceSummariesData.percentArr[1]"></el-progress>
                      </li>
                      <li>
                        <div class="hd"><i class="icon ion-stats-bars"></i>
                          <span
                            v-if="performanceSummariesData.avgThirdPartyTime>0">第三方调用：{{performanceSummariesData.avgThirdPartyTime}} ms</span>
                          <span v-else>无第三方调用</span>
                        </div>
                        <el-progress :show-text="false"
                                     :percentage="performanceSummariesData.percentArr[2]"></el-progress>
                      </li>

                    </ul>
                  </div>
                  <div class="half-circle">
                    <div class="center">{{performanceSummariesData.avgElapsed}} ms</div>
                  </div>
                </div>
                <div class="r">
                  <ul class="list-wrap">
                    <li class="clearfix" :class="{cur:curFRRowIndex===index}" v-for="(item, index) in TransactiondiagramtopNcomponentsData"
                        @click="showSecondInfo(item.name,index)" :key="index">
                      <span
                      class=" component-name">{{item.name}}</span>
                      <span
                      class=" rtext">{{item.timeContributed}} ms</span>
                    </li>
                  </ul>
                </div>
              </div>
              <div class="row-second clearfix" v-show="secondShow">
                <div class="left-box">
                  <div class="title"><span>{{transName}}</span></div>
                  <div class="content"><span>平均响应时间 {{performanceSummariesData.avgElapsed}} ms</span></div>
                </div>
                <div class="arrow-box">
                  <div class="t">{{TransactiondiagramtimecontributedData.transRate}}%</div>
                  <div class="c">
                    <div class="line"></div>
                    <div class="arrow"></div>
                  </div>
                  <div class="b">{{TransactiondiagramtimecontributedData.timesPerTrans}}次</div>
                </div>
                <div class="math-box">
                  <div class="title">{{componentName}}</div>
                  <div class="content">
                    <div class="tr">
                      <div class="c-1"></div>
                      <div class="c-2">平均响应时间</div>
                      <div class="c-3">{{TransactiondiagramtimecontributedData.averageResponseTime}} ms</div>
                    </div>
                    <div class="tr">
                      <div class="c-1"><i class="icon ion-close"></i></div>
                      <div class="c-2">调用比例</div>
                      <div class="c-3">{{TransactiondiagramtimecontributedData.transRate}} %</div>
                    </div>
                    <div class="tr">
                      <div class="c-1"><i class="icon ion-close"></i></div>
                      <div class="c-2">调用次数／请求</div>
                      <div class="c-3">{{TransactiondiagramtimecontributedData.timesPerTrans}} 次</div>
                    </div>
                    <div class="line"></div>
                    <div class="tr">
                      <div class="c-1"><span class="equal">=</span></div>
                      <div class="c-2">响应时间贡献值</div>
                      <div class="c-3">{{TransactiondiagramtimecontributedData.timeContributed}} ms</div>
                    </div>
                    <div class="tr">
                      <div class="c-4">
                        <el-progress :text-inside="true" :stroke-width="12"
                                     :percentage="TransactiondiagramtimecontributedData.perRate"></el-progress>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="arrow-box">
                  <div class="t"></div>
                  <div class="c">
                    <div class="line"></div>
                    <div class="arrow"></div>
                  </div>
                  <div class="b"></div>
                </div>
                <div class="list-box">
                  <div class="title">相关请求(TOP5)</div>
                  <div class="content">
                    <el-table :data="TransactiondiagramtopNcallsData" class="table-list">
                      <el-table-column label="URL" prop="url">
                        <template slot-scope="scope">
                          <i title="正常" class="icon-apdex fn-fl mr6" :class="scope.row.transClass"></i>
                          <a class="theme-font-color-primary" style="{
                   overflow: hidden;
                   text-overflow: ellipsis;
                   word-wrap: break-word;
                   display: -webkit-box;
                   -webkit-line-clamp: 3;
                   -webkit-box-orient: vertical;
            }"
                             href="javascript:void(0);"
                             @click="goToNextPage(scope.row.transId)">{{ scope.row.url }}</a>
                        </template>
                      </el-table-column>
                      <el-table-column width="100" label="执行时间(ms)" prop="componentsElapsed"></el-table-column>
                    </el-table>
                  </div>
                </div>
              </div>
            </div>
          </div>


          <div class="row-third">
            <div class="l">
              <div class="common-container">
                <div class="header-title">
                  <i class="title-icon icon ion-stats-bars"></i>
                  <span class="title-name">响应时间和请求数</span>
                  <div class="right-info">
                    <span class="r-btn" :class="{cur:percentageN===0}" @click="percentageN=0">所有</span>
                    <span class="r-btn" :class="{cur:percentageN===10}" @click="percentageN=10">10%</span>
                    <span class="r-btn" :class="{cur:percentageN===5}" @click="percentageN=5">5%</span>
                  </div>
                </div>
                <div class="content">
                  <div class="chart-wrap">
                    <ChartLineBar :optionData="TransactiondiagramreqcountsummaryData"></ChartLineBar>
                  </div>
                </div>
              </div>
            </div>
            <div class="r">
              <div class="common-container" style="margin-left: 0">
                <div class="header-title">
                  <i class="title-icon icon ion-stats-bars"></i>
                  <span class="title-name">请求统计</span>
                  <div class="right-info">
                    <span>共{{TransactiondiagramreqcountsectionsummaryData.total}}次</span>
                  </div>
                </div>

                <table class="list-wrap">
                  <tr>
                    <td class="c-1">正常</td>
                    <td class="c-2">
                      <el-progress :text-inside="true" :stroke-width="12"
                                   :percentage="TransactiondiagramreqcountsectionsummaryData.percent[0]"></el-progress>
                    </td>
                    <td class="c-3">{{TransactiondiagramreqcountsectionsummaryData.normalReqCount}}</td>
                  </tr>
                  <tr>
                    <td class="c-1">缓慢</td>
                    <td class="c-2">
                      <el-progress :text-inside="true" :stroke-width="12"
                                   :percentage="TransactiondiagramreqcountsectionsummaryData.percent[1]"></el-progress>
                    </td>
                    <td class="c-3">{{TransactiondiagramreqcountsectionsummaryData.slowReqCount}}</td>
                  </tr>
                  <tr>
                    <td class="c-1">非常慢</td>
                    <td class="c-2">
                      <el-progress :text-inside="true" :stroke-width="12"
                                   :percentage="TransactiondiagramreqcountsectionsummaryData.percent[2]"></el-progress>
                    </td>
                    <td class="c-3">{{TransactiondiagramreqcountsectionsummaryData.veryslowReqCount}}</td>
                  </tr>
                  <tr>
                    <td class="c-1">错误</td>
                    <td class="c-2">
                      <el-progress :text-inside="true" :stroke-width="12"
                                   :percentage="TransactiondiagramreqcountsectionsummaryData.percent[3]"></el-progress>
                    </td>
                    <td class="c-3">{{TransactiondiagramreqcountsectionsummaryData.errorReqCount}}</td>
                  </tr>
                </table>

              </div>
            </div>
          </div>
          <div class="common-container">
            <div class="header-title">
              <i class="title-icon icon ion-stats-bars"></i>
              <span class="title-name">错误信息(Top5)</span>
            </div>
            <div class="row-fourth">
              <div class="main-con">
                <div class="l">
                  <div class="chart-wrap">
                    <ChartPie :optionData="errorsummary.optionData"></ChartPie>
                  </div>
                </div>
                <div class="r">
                  <el-table :data="errorsummary.list" class="table-list">
                    <el-table-column
                      type="index"
                      width="50">
                    </el-table-column>
                    <el-table-column label="错误信息" prop="error"></el-table-column>
                    <el-table-column label="发生次数" prop="value"></el-table-column>
                    <el-table-column label="开始时间" prop="stringTime"></el-table-column>
                    <el-table-column label="结束时间" prop="finishTime"></el-table-column>
                  </el-table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </el-tab-pane>
      <el-tab-pane label="拓扑图">
        <div class="common-container">
          <div class="topo-box">
            <Topo
              :data="topoData"
              :update="update"
              :attachmentSummary="attachmentSummary"
              key="single-transaction"
            >
            </Topo>
          </div>
        </div>
      </el-tab-pane>
      <el-tab-pane label="快照分析">
        <div class="snapshot-analyze">
          <div class="common-container">
            <div class="header-title">
              <i class="title-icon icon ion-stats-bars"></i>
              <span class="title-name">事务分布图</span>
            </div>
            <div class="chartbar-warp">
              <ChartLineBar :optionData="TransactionsnapsectionsData"></ChartLineBar>
            </div>
          </div>
          <div class="common-container">
            <div class="header-title">
              <i class="title-icon icon ion-stats-bars"></i>
              <span class="title-name">快照列表</span>
            </div>
            <div class="content">
              <div class="list-wrap">
                <el-table
                  @sort-change="snapSortChange" :data="TransactionsnaplistData.list"
                  v-loading="snapListloading"
                  class="table-list">
                  <el-table-column label="URL" prop="url">
                    <template slot-scope="scope">
                      <i title="正常" class="icon-apdex " :class="scope.row.transClass"></i> <a
                      class="theme-font-color-primary"
                      href="javascript:void(0);"
                      @click="goToNextPage(scope.row.transId)">{{ scope.row.url }}</a>
                    </template>
                  </el-table-column>
                  <el-table-column label="发生时间" prop="startTime" sortable="custom"></el-table-column>
                  <el-table-column label="响应时间(ms)" prop="elapsed" sortable="custom"></el-table-column>
                  <el-table-column label="tier" prop="tierName"></el-table-column>
                  <el-table-column label="实例" prop="instance"></el-table-column>
                </el-table>
              </div>
              <div>
                <div class="pag-wrap">
                  <el-pagination
                    layout="total, prev, pager, next"
                    @current-change="TransactionsnaplistDataPageChange"
                    :page-size="10"
                    :total="TransactionsnaplistData.total"
                  >
                  </el-pagination>
                </div>
              </div>
            </div>
          </div>

        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import SingleTransaction from './single-transaction'

export default SingleTransaction
</script>

<style lang="scss" scoped>
@import "./_single-transaction";
</style>
