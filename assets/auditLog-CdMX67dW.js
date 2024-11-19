import{_ as Ue,o as W,Z as Ae,P as Oe,x as p,z as ce,A as Ne,ai as y,c as l,a3 as n,am as Pe,U as X,an as je,a0 as qe,a1 as b,ad as pe,ae as ze,a8 as D,ag as ge,a7 as w,ao as me,a6 as F,H as ve,ah as m,K as ee,aa as i,a9 as E,aj as fe,ap as He,aq as Fe,a5 as Ee}from"./index-DM_g1lqN.js";import{l as Ie}from"./lodash-DHyxJ22h.js";import{V as Be}from"./VContainer-D_k5L0zM.js";import{V as k,a as g}from"./VRow-BMdiV-pl.js";import{V as ye}from"./VAutocomplete-DOmuBKaq.js";import{V as be}from"./VTooltip-i7NJwBZi.js";import{V as he,a as Ke}from"./VDataTableServer-QE4vlyyE.js";import{V as O}from"./VDivider-DhDJINfn.js";import"./_commonjsHelpers-Cpj98o6Y.js";import"./VList-GKrwgULo.js";import"./VCheckboxBtn-FhQZWY81.js";const te={1:"永信台北",2:"永信桃園",3:"永信台中",4:"永信高雄",5:"好漾台北",6:"好漾台中",7:"銳皇國際",8:"集睿創映"},Re={key:0},Ye={key:1},Ze={key:2},Ge={key:3,class:"py-3"},Je={class:"text-center"},Qe={class:"d-flex flex-column gap-4"},We={class:"list-content"},Xe={class:"list-content"},et={class:"list-content"},tt={class:"list-content"},at={class:"list-content"},lt={key:0,class:"list-content"},st={class:"change-list"},rt={key:1},nt={__name:"auditLog",setup(ot){const $e=W(()=>_.value?"default":"small"),B=Ae(),{apiAuth:N}=je(),{smAndUp:_,mdAndUp:ae,lgAndUp:le}=Oe(),V=p([]),f=p([]),K=p(!1),R=p(!1),P=p(""),S=p(""),j=p(!1),Y=p([]),T=p(1),M=p(10),Z=p(0),L=p([{key:"createdAt",order:"desc"}]),De={class:"header-bg"},r=p({operatorId:null,targetId:null,action:"",targetModel:"",startDate:null,endDate:null}),q=p(!1),$=p(null),we=e=>{$.value=e,q.value=!0},Ve=[{title:"創建",value:"創建"},{title:"修改",value:"修改"},{title:"刪除",value:"刪除"}],xe=[{title:"員工資料",value:"users"},{title:"部門資料",value:"departments"},{title:"設備資料",value:"assets"}],G=e=>({users:"員工資料",departments:"部門資料",assets:"資產資料"})[e]||e,se=e=>{if(!e)return"";if(typeof e=="object"){if(e.name&&e.departmentId)return`${e.name} (${e.departmentId})`;if(e.name&&e.userId)return`${e.name} (${e.userId})`}return e},ke={name:"姓名",englishName:"英文名",email:"電子郵件",cellphone:"手機號碼",extNumber:"分機號碼",printNumber:"列印編號",department:"部門",companyId:"公司",company:"公司",companyName:"公司名稱",jobTitle:"職稱",role:"權限",employmentStatus:"任職狀態",gender:"性別",guideLicense:"領隊證",salary:"薪資",birthDate:"生日",hireDate:"入職日期",resignationDate:"離職日期",emergencyName:"緊急聯絡人",emergencyCellphone:"緊急聯絡電話",emergencyRelationship:"緊急聯絡人關係",permanentAddress:"戶籍地址",contactAddress:"聯絡地址",IDNumber:"身分證號碼",userId:"員工編號",departmentId:"部門編號",note:"備註",description:"描述",cowellAccount:"科威帳號",cowellPassword:"科威密碼"},z=[{title:"操作時間",align:"start",sortable:!0,key:"createdAt"},{title:"操作人員",align:"start",sortable:!0,key:"operatorId"},{title:"資料類型",align:"start",sortable:!0,key:"targetModel"},{title:"動作",align:"start",sortable:!0,key:"actionType"},{title:"操作對象",align:"start",sortable:!0,key:"targetId"},{title:"異動內容",align:"start",sortable:!1,key:"changes"},{title:"查看",align:"center",sortable:!1,key:"actions"}],_e=W(()=>_.value?ae.value?le.value?z:z.filter(e=>e.key!=="changes"):z.filter(e=>["createdAt","operatorId","targetModel","actionType","actions"].includes(e.key)):z.filter(e=>["createdAt","targetModel","actions"].includes(e.key))),Ce=Ie.debounce(async e=>{K.value=!0;try{const{data:t}=await N.get("/user/suggestions",{params:{search:e}});if(t.success)V.value=t.result;else if(e){const s={name:e,userId:e};V.value=[s],r.value.operatorId=s}else V.value=[]}catch(t){console.error("搜索操作人員失敗:",t),V.value=[]}finally{K.value=!1}},300),Se=Ie.debounce(async e=>{R.value=!0;try{let t;switch(H.value){case"users":if(t=await N.get("/user/suggestions",{params:{search:e}}),t.data.success)f.value=t.data.result.map(s=>({_id:s._id,name:s.name,userId:s.userId}));else if(e){const s={name:e,userId:e};f.value=[s],r.value.targetId=s}else f.value=[];break;case"departments":if(t=await N.get("/department/all",{params:{search:e,searchFields:["name","departmentId"]}}),t.data.success)f.value=t.data.result.data.map(s=>({_id:s._id,name:s.name,departmentId:s.departmentId}));else if(e){const s={name:e,departmentId:e};f.value=[s],r.value.targetId=s}else f.value=[];break}}catch(t){console.error("搜尋被操作對象失敗:",t),f.value=[]}finally{R.value=!1}},300),re=()=>{var e;P.value="",V.value=[],((e=r.value.operatorId)==null?void 0:e.name)!==P.value&&(r.value.operatorId=null)},ne=()=>{var e;S.value="",f.value=[],((e=r.value.targetId)==null?void 0:e.name)!==S.value&&(r.value.targetId=null)},oe=e=>{if(!e)return"-";const t=new Date(e),s=a=>String(a).padStart(2,"0");return`${t.getFullYear()}-${s(t.getMonth()+1)}-${s(t.getDate())} ${s(t.getHours())}:${s(t.getMinutes())}`},J=e=>{if(!e)return"-";const t=new Date(e),s=a=>String(a).padStart(2,"0");return`${t.getFullYear()}-${s(t.getMonth()+1)}-${s(t.getDate())}`},de=e=>{var t,s,a;return e?(t=e.operator)!=null&&t.name&&((s=e.operator)!=null&&s.userId)?`${e.operator.name} (${e.operator.userId})`:(a=e.operatorInfo)!=null&&a.name?`${e.operatorInfo.name}${e.operatorInfo.userId?` (${e.operatorInfo.userId})`:""}`:"系統":"-"},ue=e=>{var t,s,a,d,u,o,c,h,A,C;if(!e)return"-";if(e.targetData)switch(e.targetModel){case"users":{const I=e.targetData.name||"-",v=e.targetData.userId?` (${e.targetData.userId})`:"";return`${I}${v}`}case"departments":{const I=e.targetData.name||"-",v=e.targetData.departmentId?` (${e.targetData.departmentId})`:"",x=te[e.targetData.companyId]||"";return`${I}${v}${x?` - ${x}`:""}`}default:return`${e.targetData.name||"-"}`}if(e.targetInfo)switch(e.targetModel){case"users":{const I=e.targetInfo.name||"-",v=e.targetInfo.userId?` (${e.targetInfo.userId})`:"";return`${I}${v}`}case"departments":{const I=e.targetInfo.name||"-",v=e.targetInfo.departmentId?` (${e.targetInfo.departmentId})`:"",x=te[e.targetInfo.companyId]||"";return`${I}${v}${x?` - ${x}`:""}`}default:return`${e.targetInfo.name||"-"}`}if(e.changes)switch(e.targetModel){case"users":{const I=e.action==="刪除"?((t=e.changes.name)==null?void 0:t.from)||"-":((s=e.changes.name)==null?void 0:s.to)||"-",v=e.action==="刪除"?((a=e.changes.userId)==null?void 0:a.from)||"":((d=e.changes.userId)==null?void 0:d.to)||"";return`${I}${v?` (${v})`:""}`}case"departments":{const I=e.action==="刪除"?((u=e.changes.name)==null?void 0:u.from)||"-":((o=e.changes.name)==null?void 0:o.to)||"-",v=e.action==="刪除"?((c=e.changes.departmentId)==null?void 0:c.from)||"":((h=e.changes.departmentId)==null?void 0:h.to)||"",x=e.action==="刪除"?((A=e.changes.companyId)==null?void 0:A.from)||"":((C=e.changes.companyId)==null?void 0:C.to)||"",ie=te[x]||"";return`${I}${v?` (${v})`:""}${ie?` - ${ie}`:""}`}default:return"-"}return"-"},Te=(e,t="")=>{if(e==="name"){if(t==="users")return"姓名";if(t==="departments")return"部門名稱"}return ke[e]||e},Q=e=>{if(!(e!=null&&e.changes))return[];const t=[],s=new Set;return Object.entries(e.changes).forEach(([a,d])=>{if(!d||typeof d!="object"||!("from"in d)&&!("to"in d)||s.has(a))return;const u=d.from===""||d.from===null?"(無)":d.from,o=d.to===""||d.to===null?"(無)":d.to,c=Te(a,e.targetModel);if(a==="cowellAccount"||a==="cowellPassword"){t.push(`${c}: 已設定`),s.add(a);return}if(e.action==="創建"){o!=="(無)"&&(t.push(a==="birthDate"||a==="hireDate"?`${c}: ${J(o)}`:`${c}: ${o}`),s.add(a));return}if(u!==o&&c){switch(a){case"birthDate":case"hireDate":case"resignationDate":t.push(`${c}: ${u==="(無)"?u:J(u)} → ${o==="(無)"?o:J(o)}`);break;case"salary":t.push(`${c}: ${u==="(無)"?u:u==null?void 0:u.toLocaleString()} → ${o==="(無)"?o:o==null?void 0:o.toLocaleString()}`);break;case"guideLicense":t.push(`${c}: ${u==="(無)"?u:u?"有":"無"} → ${o==="(無)"?o:o?"有":"無"}`);break;default:t.push(`${c}: ${u} → ${o}`)}s.add(a)}}),e.action==="創建"&&t.length===0&&t.push(`新增${G(e.targetModel)}`),t},Me=()=>{r.value={operatorId:null,targetId:null,action:"",targetModel:"",startDate:null,endDate:null},re(),ne(),U()},H=W(()=>r.value.targetModel),U=async()=>{var e,t,s,a,d,u;if(r.value.startDate&&r.value.endDate){const o=new Date(r.value.startDate),c=new Date(r.value.endDate);if(o>c){B({text:"結束日期不能早於開始日期",snackbarProps:{color:"warning"}});return}}j.value=!0;try{const o={page:T.value,itemsPerPage:M.value,sortBy:((e=L.value[0])==null?void 0:e.key)||"createdAt",sortOrder:((t=L.value[0])==null?void 0:t.order)||"desc"};if(r.value.startDate){const h=new Date(r.value.startDate);h.setHours(0,0,0,0),o.startDate=h.toISOString()}if(r.value.endDate){const h=new Date(r.value.endDate);h.setHours(23,59,59,999),o.endDate=h.toISOString()}(s=r.value.operatorId)!=null&&s._id&&(o.operatorId=r.value.operatorId._id),(a=r.value.targetId)!=null&&a._id&&(o.targetId=r.value.targetId._id),r.value.action&&(o.action=r.value.action),r.value.targetModel&&(o.targetModel=r.value.targetModel);const c=await N.get("/auditlog/all",{params:o});if(c.data.success){const{data:h,totalItems:A}=c.data.result;Y.value=h,Z.value=A;const C=Math.ceil(A/M.value);C>0&&T.value>C&&(T.value=C,await U())}else throw new Error(c.data.message)}catch(o){console.error("搜尋失敗:",o),B({text:((u=(d=o==null?void 0:o.response)==null?void 0:d.data)==null?void 0:u.message)||"搜尋時發生錯誤",snackbarProps:{color:"error"}}),Y.value=[],Z.value=0}finally{j.value=!1}},Le=async({page:e,itemsPerPage:t,sortBy:s})=>{T.value=e,M.value=t,(s==null?void 0:s.length)>0&&(L.value=s),await U()};return ce([()=>r.value.startDate,()=>r.value.endDate],([e,t])=>{if(e&&t){const s=new Date(e),a=new Date(t);s>a&&(B({text:"結束日期不能早於開始日期",snackbarProps:{color:"warning"}}),r.value.endDate=null)}}),ce(()=>r.value.targetModel,e=>{r.value.targetId=null,S.value="",f.value=[]}),Ne(async()=>{await U()}),(e,t)=>{const s=qe("v-date-input");return b(),y(X,null,[l(Be,{"max-width":"2500"},{default:n(()=>[l(k,{class:"pt-md-5"},{default:n(()=>[l(g,{cols:"12",lg:"4",xl:"3"},{default:n(()=>[l(k,null,{default:n(()=>[l(g,{cols:"12",class:"mt-1 px-lg-10"},{default:n(()=>[l(pe,{class:"elevation-4 rounded-xl py-4 py-sm-8 px-4 px-sm-4 px-xl-8"},{default:n(()=>[l(ze,{class:"font-weight-bold d-flex align-center"},{default:n(()=>t[14]||(t[14]=[D(" 搜尋條件 ")])),_:1}),l(ge,{class:"pa-2"},{default:n(()=>[l(k,null,{default:n(()=>[l(g,{cols:"12",sm:"6",lg:"12"},{default:n(()=>[l(ye,{modelValue:r.value.operatorId,"onUpdate:modelValue":t[0]||(t[0]=a=>r.value.operatorId=a),"search-input":P.value,"onUpdate:searchInput":t[1]||(t[1]=a=>P.value=a),items:V.value,loading:K.value,label:"操作人員","return-object":"","item-props":a=>({title:`${a.name} (${a.userId})`,value:a}),variant:"outlined",density:"compact","hide-details":"",clearable:"",creatable:"","create-filter":`(item, queryText, itemText) =>
    item.name.toLowerCase().indexOf(queryText.toLowerCase()) > -1 ||
    item.userId.toLowerCase().indexOf(queryText.toLowerCase()) > -1`,"onUpdate:search":w(Ce),"onClick:clear":re,onCreate:t[2]||(t[2]=a=>{const d={name:a,userId:a};V.value.value.push(d),r.value.value.operatorId=d})},me({selection:n(({item:a})=>{var d;return[D(m((d=a==null?void 0:a.props)==null?void 0:d.title),1)]}),_:2},[w(_)?{name:"append-inner",fn:n(()=>[l(be,{location:"top","close-delay":"200"},{activator:n(({props:a})=>[l(F,ve(a,{icon:"mdi-information",size:"18"}),null,16)]),default:n(()=>[t[15]||(t[15]=D(" 輸入員編、姓名查詢 "))]),_:1})]),key:"0"}:void 0]),1032,["modelValue","search-input","items","loading","item-props","onUpdate:search"])]),_:1}),l(g,{cols:"12",sm:"6",lg:"12"},{default:n(()=>[l(he,{modelValue:r.value.targetModel,"onUpdate:modelValue":t[3]||(t[3]=a=>r.value.targetModel=a),items:xe,label:"資料類型","item-title":"title","item-value":"value",variant:"outlined",density:"compact","hide-details":"",clearable:""},null,8,["modelValue"])]),_:1}),l(g,{cols:"12",sm:"6",lg:"12"},{default:n(()=>[l(ye,{modelValue:r.value.targetId,"onUpdate:modelValue":t[4]||(t[4]=a=>r.value.targetId=a),"search-input":S.value,"onUpdate:searchInput":t[5]||(t[5]=a=>S.value=a),items:f.value,loading:R.value,label:H.value?"操作對象":"操作對象( 請先選擇資料類型 )",disabled:!H.value,"return-object":"","item-props":a=>({title:se(a),value:a}),variant:"outlined",density:"compact","hide-details":"",clearable:"",creatable:"","create-filter":`(item, queryText, itemText) =>
    item.name.toLowerCase().indexOf(queryText.toLowerCase()) > -1 ||
    (item.userId && item.userId.toLowerCase().indexOf(queryText.toLowerCase()) > -1) ||
    (item.departmentId && item.departmentId.toLowerCase().indexOf(queryText.toLowerCase()) > -1)`,"onUpdate:search":w(Se),"onClick:clear":ne,onCreate:t[6]||(t[6]=a=>{let d;switch(H.value.value){case"users":d={name:a,userId:a};break;case"departments":d={name:a,departmentId:a};break}f.value.value.push(d),r.value.value.targetId=d})},me({selection:n(({item:a})=>[D(m(se(a.props.value)),1)]),_:2},[w(_)?{name:"append-inner",fn:n(()=>[l(be,{location:"top","close-delay":"200"},{activator:n(({props:a})=>[l(F,ve(a,{icon:"mdi-information",size:"18"}),null,16)]),default:n(()=>[t[16]||(t[16]=D(" 輸入員編、姓名、部門編號、部門名稱、設備編號、設備名稱查詢 "))]),_:1})]),key:"0"}:void 0]),1032,["modelValue","search-input","items","loading","label","disabled","item-props","onUpdate:search"])]),_:1}),l(g,{cols:"12",sm:"6",lg:"12"},{default:n(()=>[l(he,{modelValue:r.value.action,"onUpdate:modelValue":t[7]||(t[7]=a=>r.value.action=a),items:Ve,label:"操作類型","item-title":"title","item-value":"value",variant:"outlined",density:"compact","hide-details":"",clearable:""},null,8,["modelValue"])]),_:1}),l(g,{cols:"12",sm:"6",lg:"12"},{default:n(()=>[l(s,{modelValue:r.value.startDate,"onUpdate:modelValue":t[8]||(t[8]=a=>r.value.startDate=a),label:"開始日期","prepend-icon":"",variant:"outlined",density:"compact","hide-details":"",clearable:"","cancel-text":"取消","ok-text":"確認"},null,8,["modelValue"])]),_:1}),l(g,{cols:"12",sm:"6",lg:"12"},{default:n(()=>[l(s,{modelValue:r.value.endDate,"onUpdate:modelValue":t[9]||(t[9]=a=>r.value.endDate=a),label:"結束日期","prepend-icon":"",variant:"outlined",density:"compact","hide-details":"",clearable:"","cancel-text":"取消","ok-text":"確認",min:r.value.startDate},null,8,["modelValue","min"])]),_:1})]),_:1}),l(k,null,{default:n(()=>[l(g,{cols:"12",class:"d-flex justify-end gap-2"},{default:n(()=>[l(k,{class:"d-flex justify-space-between"},{default:n(()=>[l(g,{cols:"3"},{default:n(()=>[l(ee,{color:"grey",width:"40",block:"",onClick:Me},{default:n(()=>[l(F,null,{default:n(()=>t[17]||(t[17]=[D("mdi-refresh")])),_:1})]),_:1})]),_:1}),l(g,{cols:"9",class:"ps-0"},{default:n(()=>[l(ee,{color:"blue-grey-darken-1","prepend-icon":"mdi-magnify",loading:j.value,block:"",onClick:U},{default:n(()=>t[18]||(t[18]=[D(" 搜尋 ")])),_:1},8,["loading"])]),_:1})]),_:1})]),_:1})]),_:1})]),_:1})]),_:1})]),_:1})]),_:1})]),_:1}),l(g,{cols:"12",lg:"8",xl:"9",class:"px-6 ps-lg-4 pe-lg-12 mb-6"},{default:n(()=>[l(k,{class:"elevation-4 rounded-xl py-4 py-sm-8 px-1 px-sm-4 px-md-10 mt-1 bg-white"},{default:n(()=>[l(g,{cols:"12",class:"ps-4 pb-sm-6"},{default:n(()=>t[19]||(t[19]=[i("h3",null,"異動紀錄",-1)])),_:1}),l(g,{cols:"12"},{default:n(()=>[l(Ke,{"items-per-page":M.value,"onUpdate:itemsPerPage":t[10]||(t[10]=a=>M.value=a),"sort-by":L.value,"onUpdate:sortBy":t[11]||(t[11]=a=>L.value=a),items:Y.value,headers:_e.value,loading:j.value,"items-length":Z.value,"items-per-page-options":[10,20,50,100],page:T.value,"header-props":De,hover:"",density:"compact",class:"rounded-ts-lg rounded-te-lg","onUpdate:options":Le},{item:n(({item:a,index:d})=>[i("tr",{class:He({"odd-row":d%2===0,"even-row":d%2!==0})},[i("td",null,m(oe(a.createdAt)),1),w(_)?(b(),y("td",Re,m(de(a)),1)):E("",!0),i("td",null,m(G(a.targetModel)),1),w(_)?(b(),y("td",Ye,m(a.action),1)):E("",!0),w(ae)?(b(),y("td",Ze,m(ue(a)),1)):E("",!0),w(le)?(b(),y("td",Ge,[(b(!0),y(X,null,fe(Q(a),(u,o)=>(b(),y("div",{key:o},m(u),1))),128))])):E("",!0),i("td",Je,[l(F,{icon:"mdi-book-open-variant-outline",color:"blue-grey-darken-3",size:"small",class:"my-4",onClick:u=>we(a)},null,8,["onClick"])])],2)]),_:1},8,["items-per-page","sort-by","items","headers","loading","items-length","page"])]),_:1})]),_:1})]),_:1})]),_:1})]),_:1}),l(Pe,{modelValue:q.value,"onUpdate:modelValue":t[13]||(t[13]=a=>q.value=a),width:"600"},{default:n(()=>[l(pe,{class:"pa-4"},{default:n(()=>[t[27]||(t[27]=i("div",{class:"ps-6 pt-4 pb-1 pb-sm-3 card-title"}," 異動詳細資料 ",-1)),l(ge,null,{default:n(()=>[l(k,null,{default:n(()=>[l(g,{cols:"12"},{default:n(()=>{var a,d,u;return[i("div",Qe,[i("div",null,[t[20]||(t[20]=i("div",{class:"text-grey-darken-1 list-title"}," 操作時間 ",-1)),i("div",We,m(oe((a=$.value)==null?void 0:a.createdAt)),1)]),l(O,{class:"my-2"}),i("div",null,[t[21]||(t[21]=i("div",{class:"text-grey-darken-1 list-title"}," 操作人員 ",-1)),i("div",Xe,m(de($.value)),1)]),l(O,{class:"my-2"}),i("div",null,[t[22]||(t[22]=i("div",{class:"text-grey-darken-1 list-title"}," 操作對象 ",-1)),i("div",et,m(ue($.value)),1)]),l(O,{class:"my-2"}),i("div",null,[t[23]||(t[23]=i("div",{class:"text-grey-darken-1 list-title"}," 操作類型 ",-1)),i("div",tt,m((d=$.value)==null?void 0:d.action),1)]),l(O,{class:"my-2"}),i("div",null,[t[24]||(t[24]=i("div",{class:"text-grey-darken-1 list-title"}," 資料類型 ",-1)),i("div",at,m(G((u=$.value)==null?void 0:u.targetModel)),1)]),l(O,{class:"my-2"}),i("div",null,[t[25]||(t[25]=i("div",{class:"text-grey-darken-1 list-title"}," 異動內容 ",-1)),Q($.value).length>0?(b(),y("div",lt,[i("ul",st,[(b(!0),y(X,null,fe(Q($.value),(o,c)=>(b(),y("li",{key:c,class:"py-2"},m(o),1))),128))])])):(b(),y("div",rt," 無異動內容 "))])])]}),_:1})]),_:1})]),_:1}),l(Fe,null,{default:n(()=>[l(Ee),l(ee,{color:"grey-darken-1",variant:"outlined",size:$e.value,onClick:t[12]||(t[12]=a=>q.value=!1)},{default:n(()=>t[26]||(t[26]=[D(" 關閉 ")])),_:1},8,["size"])]),_:1})]),_:1})]),_:1},8,["modelValue"])],64)}}},bt=Ue(nt,[["__scopeId","data-v-6d3143b2"]]);export{bt as default};
