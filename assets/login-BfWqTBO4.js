import{p as L,at as D,aM as N,g as T,D as Z,ax as H,aZ as K,o as X,u as Y,az as J,aA as S,c as a,H as F,_ as O,Y as Q,Z as W,x as C,A as ee,X as ae,ai as se,a3 as s,a2 as oe,a9 as M,$ as te,a0 as le,a1 as U,a7 as i,a4 as re,V as ne,as as j,a8 as k,K as B,a_ as ie,a6 as ce,a$ as ue}from"./index-ud_TzPNK.js";import{_ as de}from"./logo_horizontal-JTrVuJ1L.js";import{c as me,a as E,u as pe,d as $}from"./vee-validate-SID-rEO3.js";import{V as fe}from"./VContainer-DJs-nTPy.js";import{V as ge}from"./VForm-BSjeQzsV.js";import{V as A,a as t}from"./VRow-Cxukib5N.js";import{m as ve,V as R}from"./VCheckboxBtn-Ck-sUITW.js";import{V as G}from"./VDivider-Cq4go4WE.js";import"./_commonjsHelpers-Cpj98o6Y.js";const be=L({...D(),...N(ve(),["inline"])},"VCheckbox"),ke=T()({name:"VCheckbox",inheritAttrs:!1,props:be(),emits:{"update:modelValue":l=>!0,"update:focused":l=>!0},setup(l,f){let{attrs:g,slots:r}=f;const c=Z(l,"modelValue"),{isFocused:u,focus:d,blur:V}=H(l),x=K(),b=X(()=>l.id||`checkbox-${x}`);return Y(()=>{const[m,v]=J(g),y=S.filterProps(l),w=R.filterProps(l);return a(S,F({class:["v-checkbox",l.class]},m,y,{modelValue:c.value,"onUpdate:modelValue":o=>c.value=o,id:b.value,focused:u.value,style:l.style}),{...r,default:o=>{let{id:e,messagesId:p,isDisabled:n,isReadonly:_,isValid:h}=o;return a(R,F(w,{id:e.value,"aria-describedby":p.value,disabled:n.value,readonly:_.value},v,{error:h.value===!1,modelValue:c.value,"onUpdate:modelValue":P=>c.value=P,onFocus:d,onBlur:V}),r)}})}),{}}}),q={},Ve={key:0,id:"background",class:"d-flex justify-center align-center"},xe="890205288379-2bm447qt1rj7jkooc7luqej83if9inp4.apps.googleusercontent.com",z={__name:"login",setup(l){const f=te(),g=Q(),r=W(),c=C(!0),u=C(!1),d=C(!1),V=me({email:E().required("請輸入email").email("請輸入正確email格式"),password:E().required("請輸入密碼")}),{handleSubmit:x,isSubmitting:b}=pe({validationSchema:V}),m=$("email"),v=$("password"),y=async o=>{try{if(console.log("Google Response:",o),!o.code)throw new Error("未收到 Google 授權碼");const e=await g.googleLogin(o.code);e==="登入成功"?(r({text:"登入成功",snackbarProps:{color:"teal-lighten-1"}}),f.push("/profile")):r({text:e,snackbarProps:{color:"red-lighten-1"}})}catch(e){console.error("Google 登入錯誤:",e),r({text:"Google 登入失敗,請稍後再試",snackbarProps:{color:"red-lighten-1"}})}},w=x(async o=>{d.value?localStorage.setItem("savedEmail",o.email):localStorage.removeItem("savedEmail");const e=await g.login(o);e==="登入成功"?(r({text:e,snackbarProps:{color:"teal-lighten-1"}}),f.push("/profile")):r({text:e,snackbarProps:{color:"red-lighten-1"}})});return ee(async()=>{const o=localStorage.getItem("savedEmail");o&&(m.value.value=o,d.value=!0);const e=new URLSearchParams(window.location.search),p=e.get("token"),n=e.get("email"),_=e.get("avatar"),h=e.get("name"),P=parseInt(e.get("role"),10),I=e.get("message");if(I){r({text:I,snackbarProps:{color:"red-lighten-1"}}),c.value=!1;return}p&&(g.$patch({token:p,email:n,avatar:_,name:h,role:P}),await ae(),r({text:"登入成功",snackbarProps:{color:"teal-lighten-1"}}),f.push("/")),c.value=!1}),(o,e)=>{const p=le("router-link");return c.value?M("",!0):(U(),se("div",Ve,[a(fe,{width:"380",height:"510",class:"login-wrapper mx-2 mx-sm-0"},{default:s(()=>[a(ge,{disabled:i(b),onSubmit:re(i(w),["prevent"])},{default:s(()=>[a(A,{class:"px-4"},{default:s(()=>[a(t,{cols:"12",class:"pt-9 pb-6 pe-8 d-flex justify-center"},{default:s(()=>[a(ne,{src:de,"max-width":"200"})]),_:1}),a(t,{cols:"12"},{default:s(()=>[a(j,{modelValue:i(m).value.value,"onUpdate:modelValue":e[0]||(e[0]=n=>i(m).value.value=n),"error-messages":i(m).errorMessage.value,label:"email",density:"compact",variant:"underlined",clearable:""},null,8,["modelValue","error-messages"])]),_:1}),a(t,{cols:"12",class:"pb-1"},{default:s(()=>[a(j,{modelValue:i(v).value.value,"onUpdate:modelValue":e[1]||(e[1]=n=>i(v).value.value=n),"error-messages":i(v).errorMessage.value,type:u.value?"text":"password","append-inner-icon":u.value?"mdi-eye-off":"mdi-eye",label:"password",density:"compact",variant:"underlined","onClick:appendInner":e[2]||(e[2]=n=>u.value=!u.value)},null,8,["modelValue","error-messages","type","append-inner-icon"])]),_:1}),a(t,{cols:"12",class:"ps-2 pe-4 py-0 d-flex justify-space-between align-center"},{default:s(()=>[a(ke,{modelValue:d.value,"onUpdate:modelValue":e[3]||(e[3]=n=>d.value=n),label:"記住我","hide-details":"",density:"compact",color:"grey-darken-2",class:"text-caption"},null,8,["modelValue"]),a(p,{class:"text-caption text-blue-grey-darken-2",to:"./forgotPassword"},{default:s(()=>e[4]||(e[4]=[k(" 忘記密碼？ ")])),_:1})]),_:1}),a(t,{cols:"12",class:"text-center"},{default:s(()=>[a(B,{block:"",elevation:"2",color:"blue-grey-darken-2",type:"submit",loading:i(b)},{default:s(()=>e[5]||(e[5]=[k(" Login ")])),_:1},8,["loading"])]),_:1}),a(t,{cols:"12",class:"py-0 ps-2"}),a(t,null,{default:s(()=>[a(A,null,{default:s(()=>[a(t,{cols:"5"},{default:s(()=>[a(G,{class:"my-4"})]),_:1}),a(t,{cols:"2",class:"d-flex align-center justify-center pa-0",style:{"letter-spacing":"2px","font-size":"15px",opacity:"60%"}},{default:s(()=>e[6]||(e[6]=[k(" 或使用 ")])),_:1}),a(t,{cols:"5"},{default:s(()=>[a(G,{class:"my-4"})]),_:1})]),_:1})]),_:1}),a(t,{cols:"12",class:"text-center"},{default:s(()=>[a(i(ie),{callback:y,"client-id":xe,prompt:"",class:"w-100"},{default:s(()=>[a(B,{block:"",elevation:"2",color:"cyan-darken-3"},{default:s(()=>[a(ce,{icon:"mdi-google-plus",size:"24",class:"me-2"}),e[7]||(e[7]=k("Google 登入 "))]),_:1})]),_:1})]),_:1})]),_:1})]),_:1},8,["disabled","onSubmit"])]),_:1}),c.value?(U(),oe(ue,{key:0,indeterminate:"",size:"64",color:"primary",class:"center-screen"})):M("",!0)]))}}};typeof q=="function"&&q(z);const Me=O(z,[["__scopeId","data-v-d6fe0678"]]);export{Me as default};
