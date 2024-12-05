import{_ as pe,Z as ce,x as c,Y as fe,aq as ve,o as F,A as ge,a3 as v,a4 as a,a0 as ye,$ as xe,a1 as Ve,a2 as d,c as t,K as f,a8 as z,a9 as r,ae as k,ak as A,aa as M,ab as i,ap as be,aj as m,a7 as U,al as ke,U as _e,as as we,ag as j,ai as q,at as G,a6 as H,au as K,a5 as De,ar as Ce,av as Ae,aw as g}from"./index-CEUVR7RQ.js";import{Q as Me}from"./vue-quill.snow-B_ufE7tA.js";import{b as O}from"./route-block-B_A1xBdJ.js";import{V as Ue}from"./VContainer-D-TpANnr.js";import{a as y,V as Q}from"./VRow-DoWseTgQ.js";import{b as he,V as Te,a as Ie,d as Ne}from"./VList-DOI9Pofw.js";import{V as Se}from"./VAlert-BIGw2Ygz.js";import{V as Re}from"./VForm-CcbGa_35.js";import{V as Be}from"./VSelect-CcYVlXzf.js";import{V as Le}from"./VFileInput-4ylzSqY_.js";import{V as Pe}from"./VCheckbox-BjTITKb_.js";import"./_commonjsHelpers-BosuxZz1.js";import"./VDivider-BEhlNDsF.js";import"./VCheckboxBtn-CYsTMO8j.js";var Ee={};const $e={key:0,class:"d-flex justify-end mb-4"},Fe={class:"d-flex align-center mb-6"},ze={class:"text-h4 font-weight-bold"},je={class:"d-flex flex-wrap gap-4"},qe={class:"d-flex align-center"},Ge={class:"d-flex align-center"},He={class:"d-flex align-center"},Ke={key:0,class:"d-flex align-center"},Oe=["innerHTML"],Qe={key:1,class:"d-flex justify-center py-12"},W={__name:"[id]",setup(We){const h=ye(),R=xe(),{apiAuth:T}=Ae(),x=ce(),s=c(null),I=c(!0),Y=fe(),{userId:B,role:_}=ve(Y),V=c(!1),b=c({show:!1}),N=c(null),w=c(!1),D=c(!1),u=c({title:"",content:"",type:"一般",attachments:[],expiryDate:null}),C=c(!1),Z=["置頂","重要","活動","系統","一般"],J=F(()=>{const l=new Date;return l.setDate(l.getDate()+1),l.toISOString().split("T")[0]}),X={置頂:"red",重要:"orange",活動:"green",系統:"blue",一般:"grey"},ee=l=>X[l]||"grey",te=l=>l==="一般"?"black":"white",S=l=>new Date(l).toLocaleString("zh-TW",{year:"numeric",month:"2-digit",day:"2-digit",hour:"2-digit",minute:"2-digit"}),le=l=>{if(l===0)return"0 Bytes";const e=1024,o=["Bytes","KB","MB","GB"],n=Math.floor(Math.log(l)/Math.log(e));return parseFloat((l/Math.pow(e,n)).toFixed(2))+" "+o[n]},ae=l=>({image:"mdi-file-image",application:"mdi-file-document",text:"mdi-file-document-outline",video:"mdi-file-video",audio:"mdi-file-music"})[l]||"mdi-file",oe=l=>`${Ee.UPLOAD_URL}/${l}`,L=async()=>{var l,e;I.value=!0;try{const{data:o}=await T.get(`/announcement/${h.params.id}`);if(o.success)s.value=o.result;else throw new Error(o.message||"無法載入公告內容")}catch(o){console.error("Error fetching announcement:",o),x({text:((e=(l=o==null?void 0:o.response)==null?void 0:l.data)==null?void 0:e.message)||"無法載入公告內容",snackbarProps:{color:"error"}})}finally{I.value=!1}},ne=F(()=>{var l,e,o,n;if(!_.value)return!1;if([g.SUPER_ADMIN,g.ADMIN,g.MANAGER].includes(Number(_.value))){if([g.SUPER_ADMIN,g.ADMIN].includes(Number(_.value)))return!0;if(g.MANAGER===Number(_.value))return((e=(l=s.value)==null?void 0:l.author)==null?void 0:e._id)===B.value}return((n=(o=s.value)==null?void 0:o.author)==null?void 0:n._id)===B.value}),se=[l=>!!l||"請輸入標題",l=>l&&l.length<=100||"標題不能超過100個字"],re=[l=>!l||!l.length||l.length<=10||"最多只能上傳10個檔案",l=>!l||!l.some(e=>e.size>10*1024*1024)||"檔案大小不能超過10MB"],ue=()=>{u.value={title:s.value.title,content:s.value.content,type:s.value.type,attachments:[],expiryDate:s.value.expiryDate},C.value=!!s.value.expiryDate,b.value.show=!0},ie=()=>{b.value.show=!1,N.value&&N.value.reset()},P=async()=>{var l,e;if(w.value){D.value=!0;try{const{data:o}=await T.patch(`/announcement/${h.params.id}`,u.value);o.success&&(x({text:"公告編輯成功",snackbarProps:{color:"success"}}),b.value.show=!1,L())}catch(o){console.error("編輯公告失敗:",o),x({text:((e=(l=o==null?void 0:o.response)==null?void 0:l.data)==null?void 0:e.message)||"編輯失敗",snackbarProps:{color:"error"}})}finally{D.value=!1}}},de=()=>{V.value=!0},me=async()=>{var l,e;try{const{data:o}=await T.delete(`/announcement/${h.params.id}`);o.success&&(x({text:"公告刪除成功",snackbarProps:{color:"success"}}),R.push("/announcement"))}catch(o){console.error("刪除公告失敗:",o),x({text:((e=(l=o==null?void 0:o.response)==null?void 0:l.data)==null?void 0:e.message)||"刪除失敗",snackbarProps:{color:"error"}})}finally{V.value=!1}};return ge(()=>{L()}),(l,e)=>{const o=Ve("v-date-input");return d(),v(Ue,{"max-width":"1000px",class:"pa-0 pa-sm-4 ms-0 ms-sm-auto me-sm-auto"},{default:a(()=>[t(Q,null,{default:a(()=>[t(y,{cols:"12"},{default:a(()=>[t(f,{color:"grey",variant:"text","prepend-icon":"mdi-arrow-left",class:"mb-4",onClick:e[0]||(e[0]=n=>z(R).back())},{default:a(()=>e[12]||(e[12]=[r(" 返回列表 ")])),_:1}),s.value?(d(),v(k,{key:0,class:"pa-6"},{default:a(()=>{var n;return[ne.value?(d(),A("div",$e,[t(f,{color:"primary",variant:"outlined",class:"me-2","prepend-icon":"mdi-pencil",onClick:ue},{default:a(()=>e[13]||(e[13]=[r(" 編輯公告 ")])),_:1}),t(f,{color:"error",variant:"outlined","prepend-icon":"mdi-delete",onClick:de},{default:a(()=>e[14]||(e[14]=[r(" 刪除公告 ")])),_:1})])):M("",!0),i("div",Fe,[t(be,{color:ee(s.value.type),"text-color":te(s.value.type),class:"me-4"},{default:a(()=>[r(m(s.value.type),1)]),_:1},8,["color","text-color"]),i("h2",ze,m(s.value.title),1)]),t(k,{class:"mb-6 pa-4 bg-grey-lighten-4",flat:""},{default:a(()=>{var p,E,$;return[i("div",je,[i("div",qe,[t(U,{class:"me-2"},{default:a(()=>e[15]||(e[15]=[r(" mdi-account ")])),_:1}),i("span",null,m((p=s.value.author)==null?void 0:p.name),1)]),i("div",Ge,[t(U,{class:"me-2"},{default:a(()=>e[16]||(e[16]=[r(" mdi-office-building ")])),_:1}),i("span",null,m((E=s.value.department)==null?void 0:E.name)+" ("+m(($=s.value.department)==null?void 0:$.departmentId)+")",1)]),i("div",He,[t(U,{class:"me-2"},{default:a(()=>e[17]||(e[17]=[r(" mdi-clock-outline ")])),_:1}),i("span",null,m(S(s.value.createdAt)),1)]),s.value.expiryDate?(d(),A("div",Ke,[t(U,{class:"me-2"},{default:a(()=>e[18]||(e[18]=[r(" mdi-calendar-clock ")])),_:1}),i("span",null,"自動下架時間："+m(S(s.value.expiryDate)),1)])):M("",!0)])]}),_:1}),i("div",{class:"announcement-content mb-6",innerHTML:s.value.content},null,8,Oe),(n=s.value.attachments)!=null&&n.length?(d(),v(k,{key:1,class:"pa-4 bg-grey-lighten-4",flat:""},{default:a(()=>[e[19]||(e[19]=i("div",{class:"text-subtitle-1 font-weight-bold mb-3"}," 附件列表 ",-1)),t(he,null,{default:a(()=>[(d(!0),A(_e,null,ke(s.value.attachments,p=>(d(),v(Te,{key:p._id,href:oe(p.path),target:"_blank","prepend-icon":ae(p.fileType)},{default:a(()=>[t(Ie,null,{default:a(()=>[r(m(p.filename),1)]),_:2},1024),t(Ne,null,{default:a(()=>[r(m(le(p.size))+" - "+m(S(p.uploadDate)),1)]),_:2},1024)]),_:2},1032,["href","prepend-icon"]))),128))]),_:1})]),_:1})):M("",!0)]}),_:1})):I.value?(d(),A("div",Qe,[t(we,{indeterminate:"",color:"primary"})])):(d(),v(Se,{key:2,type:"error",class:"mt-4"},{default:a(()=>e[20]||(e[20]=[r(" 無法載入公告內容 ")])),_:1}))]),_:1})]),_:1}),t(K,{modelValue:V.value,"onUpdate:modelValue":e[2]||(e[2]=n=>V.value=n),"max-width":"400"},{default:a(()=>[t(k,null,{default:a(()=>[t(j,{class:"text-h5"},{default:a(()=>e[21]||(e[21]=[r(" 確認刪除 ")])),_:1}),t(q,null,{default:a(()=>e[22]||(e[22]=[r("確定要刪除此公告嗎？此操作無法復原。")])),_:1}),t(G,null,{default:a(()=>[t(H),t(f,{color:"grey",variant:"text",onClick:e[1]||(e[1]=n=>V.value=!1)},{default:a(()=>e[23]||(e[23]=[r(" 取消 ")])),_:1}),t(f,{color:"error",variant:"text",onClick:me},{default:a(()=>e[24]||(e[24]=[r(" 確認刪除 ")])),_:1})]),_:1})]),_:1})]),_:1},8,["modelValue"]),t(K,{modelValue:b.value.show,"onUpdate:modelValue":e[11]||(e[11]=n=>b.value.show=n),persistent:"","max-width":"900px",height:"100%"},{default:a(()=>[t(k,{class:"pa-4 h-100"},{default:a(()=>[t(j,{class:"text-h5 pb-4"},{default:a(()=>e[25]||(e[25]=[r(" 編輯公告 ")])),_:1}),t(q,null,{default:a(()=>[t(Re,{ref_key:"form",ref:N,modelValue:w.value,"onUpdate:modelValue":e[10]||(e[10]=n=>w.value=n),onSubmit:De(P,["prevent"])},{default:a(()=>[t(Q,null,{default:a(()=>[t(y,{cols:"12",sm:"8"},{default:a(()=>[t(Ce,{modelValue:u.value.title,"onUpdate:modelValue":e[3]||(e[3]=n=>u.value.title=n),label:"公告標題",rules:se,required:""},null,8,["modelValue"])]),_:1}),t(y,{cols:"12",sm:"4"},{default:a(()=>[t(Be,{modelValue:u.value.type,"onUpdate:modelValue":e[4]||(e[4]=n=>u.value.type=n),items:Z,label:"公告類型",required:""},null,8,["modelValue"])]),_:1}),t(y,{cols:"12"},{default:a(()=>[t(z(Me),{content:u.value.content,"onUpdate:content":e[5]||(e[5]=n=>u.value.content=n),style:{"min-height":"640px"},"content-type":"html",toolbar:"full",theme:"snow"},null,8,["content"])]),_:1}),t(y,{cols:"12",class:"px-9"},{default:a(()=>[t(Le,{modelValue:u.value.attachments,"onUpdate:modelValue":e[6]||(e[6]=n=>u.value.attachments=n),label:"附件上傳",multiple:"","show-size":"",counter:"",variant:"underlined",rules:re,accept:".jpg,.jpeg,.png,.gif,.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.zip,.rar"},null,8,["modelValue"])]),_:1}),t(y,{cols:"12"},{default:a(()=>[t(Pe,{modelValue:C.value,"onUpdate:modelValue":e[7]||(e[7]=n=>C.value=n),label:"設定自動下架時間"},null,8,["modelValue"]),C.value?(d(),v(o,{key:0,modelValue:u.value.expiryDate,"onUpdate:modelValue":e[8]||(e[8]=n=>u.value.expiryDate=n),label:"自動下架時間",min:J.value,variant:"outlined",density:"comfortable",clearable:"","ok-text":"確認","cancel-text":"取消","onClick:clear":e[9]||(e[9]=n=>u.value.expiryDate=null)},null,8,["modelValue","min"])):M("",!0)]),_:1})]),_:1})]),_:1},8,["modelValue"])]),_:1}),t(G,null,{default:a(()=>[t(H),t(f,{color:"grey",variant:"text",onClick:ie},{default:a(()=>e[26]||(e[26]=[r(" 取消 ")])),_:1}),t(f,{color:"primary",loading:D.value,disabled:!w.value||D.value,onClick:P},{default:a(()=>e[27]||(e[27]=[r(" 更新 ")])),_:1},8,["loading","disabled"])]),_:1})]),_:1})]),_:1},8,["modelValue"])]),_:1})}}};typeof O=="function"&&O(W);const dt=pe(W,[["__scopeId","data-v-f89a18a8"]]);export{dt as default};