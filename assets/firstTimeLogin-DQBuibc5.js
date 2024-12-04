import{_ as x,Y as y,Z as k,x as r,ak as C,c as o,a4 as l,$ as _,a2 as $,a5 as B,a9 as v,aw as c,ab as S,K as T,aA as A}from"./index-CjiGu90g.js";import{V as E}from"./VContainer-CytIg9tC.js";import{V as F}from"./VForm-CNx2tQbo.js";import{V as I,a as p}from"./VRow-DB8T2feP.js";const N={id:"background",class:"fill-height d-flex justify-center align-center"},U={__name:"firstTimeLogin",setup(L){const g=_(),{apiAuth:b}=A(),f=y(),w=k(),s=r({newPassword:"",confirmPassword:""}),i=r(!1),u=r(!1),n=r(""),d=r(""),m=r(!1),P=()=>{let t=!0;return n.value="",d.value="",s.value.newPassword?s.value.newPassword.length<8&&(n.value="密碼長度至少需要8個字元",t=!1):(n.value="請輸入新密碼",t=!1),s.value.confirmPassword?s.value.newPassword!==s.value.confirmPassword&&(d.value="兩次輸入的密碼不相符",t=!1):(d.value="請確認新密碼",t=!1),t},V=async()=>{var t,e;if(P())try{m.value=!0;const{data:a}=await b.patch("/user/change-password",{currentPassword:f.password,newPassword:s.value.newPassword});w({text:a.message,snackbarProps:{color:"teal-lighten-1"}}),await f.logout(),g.push("/login")}catch(a){w({text:((e=(t=a==null?void 0:a.response)==null?void 0:t.data)==null?void 0:e.message)||"修改密碼失敗",snackbarProps:{color:"red-lighten-1"}})}finally{m.value=!1}};return(t,e)=>($(),C("div",N,[o(E,{class:"first-time-login-wrapper pa-0",style:{"max-width":"360px"}},{default:l(()=>[o(F,{disabled:m.value,onSubmit:B(V,["prevent"])},{default:l(()=>[o(I,{class:"px-4 ma-0"},{default:l(()=>[o(p,{cols:"12",class:"text-center mt-4 font-weight-bold"},{default:l(()=>e[6]||(e[6]=[v(" 修改密碼 (首次登入) ")])),_:1}),o(p,{cols:"12"},{default:l(()=>[o(c,{modelValue:s.value.newPassword,"onUpdate:modelValue":[e[0]||(e[0]=a=>s.value.newPassword=a),e[2]||(e[2]=a=>n.value="")],"error-messages":n.value,type:i.value?"text":"password","append-inner-icon":i.value?"mdi-eye-off":"mdi-eye",label:"新密碼",density:"compact",variant:"underlined",autocomplete:"new-password","onClick:appendInner":e[1]||(e[1]=a=>i.value=!i.value)},null,8,["modelValue","error-messages","type","append-inner-icon"])]),_:1}),o(p,{cols:"12"},{default:l(()=>[o(c,{modelValue:s.value.confirmPassword,"onUpdate:modelValue":[e[3]||(e[3]=a=>s.value.confirmPassword=a),e[5]||(e[5]=a=>d.value="")],"error-messages":d.value,type:u.value?"text":"password","append-inner-icon":u.value?"mdi-eye-off":"mdi-eye",label:"確認新密碼",density:"compact",variant:"underlined",autocomplete:"new-password","onClick:appendInner":e[4]||(e[4]=a=>u.value=!u.value)},null,8,["modelValue","error-messages","type","append-inner-icon"])]),_:1}),o(p,{cols:"12",class:"pb-8"},{default:l(()=>[e[8]||(e[8]=S("div",{class:"text-body-2 text-medium-emphasis mb-6"}," 請修改您的初始密碼,新密碼必須至少8個字元 ",-1)),o(T,{block:"",elevation:"2",color:"blue-grey-darken-2",type:"submit",loading:m.value,disabled:!s.value.newPassword||!s.value.confirmPassword},{default:l(()=>e[7]||(e[7]=[v(" 修改密碼 ")])),_:1},8,["loading","disabled"])]),_:1})]),_:1})]),_:1},8,["disabled"])]),_:1})]))}},M=x(U,[["__scopeId","data-v-67173eaa"]]);export{M as default};
