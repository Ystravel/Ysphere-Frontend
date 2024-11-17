import{p as j,m as ce,a as de,g as ee,u as te,c as a,b as Ee,d as Ne,e as Me,f as Ae,h as ie,t as Q,i as Pe,j as He,k as De,l as Re,n as Le,s as A,o as h,q as Ue,V as J,r as ne,v as Z,w as Ke,x as q,y as Qe,z as L,A as re,B as ve,C as Ye,D as ze,E as K,F as Oe,G as We,H as se,I as $e,J as et,K as Xe,L as tt,M as at,N as lt,O as ot,P as Fe,Q as nt,R as st,S as rt,T as ut,U as G,W as it,X as ct,_ as dt,Y as vt,Z as ft,$ as mt,a0 as pe,a1 as N,a2 as R,a3 as r,a4 as gt,a5 as ht,a6 as Y,a7 as V,a8 as C,a9 as H,aa as z,ab as yt,ac as bt,ad as we,ae as _e,af as xe,ag as ke,ah as M,ai as le,aj as oe,ak as pt,al as wt}from"./index-ud_TzPNK.js";import{_ as _t}from"./logo_horizontal-JTrVuJ1L.js";import{V as Se,a as W}from"./VRow-Cxukib5N.js";import{V as ue}from"./VDivider-Cq4go4WE.js";import{V as $,a as X,b as Te}from"./VList-BDhWEYR-.js";const xt=j({text:String,...ce(),...de()},"VToolbarTitle"),kt=ee()({name:"VToolbarTitle",props:xt(),setup(e,i){let{slots:l}=i;return te(()=>{const S=!!(l.default||l.text||e.text);return a(e.tag,{class:["v-toolbar-title",e.class],style:e.style},{default:()=>{var t;return[S&&a("div",{class:"v-toolbar-title__placeholder"},[l.text?l.text():e.text,(t=l.default)==null?void 0:t.call(l)])]}})}),{}}}),St=[null,"prominent","default","comfortable","compact"],qe=j({absolute:Boolean,collapse:Boolean,color:String,density:{type:String,default:"default",validator:e=>St.includes(e)},extended:Boolean,extensionHeight:{type:[Number,String],default:48},flat:Boolean,floating:Boolean,height:{type:[Number,String],default:64},image:String,title:String,...Ee(),...ce(),...Ne(),...Me(),...de({tag:"header"}),...Ae()},"VToolbar"),Ve=ee()({name:"VToolbar",props:qe(),setup(e,i){var y;let{slots:l}=i;const{backgroundColorClasses:S,backgroundColorStyles:t}=ie(Q(e,"color")),{borderClasses:n}=Pe(e),{elevationClasses:s}=He(e),{roundedClasses:o}=De(e),{themeClasses:T}=Re(e),{rtlClasses:x}=Le(),d=A(!!(e.extended||(y=l.extension)!=null&&y.call(l))),v=h(()=>parseInt(Number(e.height)+(e.density==="prominent"?Number(e.height):0)-(e.density==="comfortable"?8:0)-(e.density==="compact"?16:0),10)),m=h(()=>d.value?parseInt(Number(e.extensionHeight)+(e.density==="prominent"?Number(e.extensionHeight):0)-(e.density==="comfortable"?4:0)-(e.density==="compact"?8:0),10):0);return Ue({VBtn:{variant:"text"}}),te(()=>{var P;const c=!!(e.title||l.title),p=!!(l.image||e.image),g=(P=l.extension)==null?void 0:P.call(l);return d.value=!!(e.extended||g),a(e.tag,{class:["v-toolbar",{"v-toolbar--absolute":e.absolute,"v-toolbar--collapse":e.collapse,"v-toolbar--flat":e.flat,"v-toolbar--floating":e.floating,[`v-toolbar--density-${e.density}`]:!0},S.value,n.value,s.value,o.value,T.value,x.value,e.class],style:[t.value,e.style]},{default:()=>[p&&a("div",{key:"image",class:"v-toolbar__image"},[l.image?a(ne,{key:"image-defaults",disabled:!e.image,defaults:{VImg:{cover:!0,src:e.image}}},l.image):a(J,{key:"image-img",cover:!0,src:e.image},null)]),a(ne,{defaults:{VTabs:{height:Z(v.value)}}},{default:()=>{var f,u,D;return[a("div",{class:"v-toolbar__content",style:{height:Z(v.value)}},[l.prepend&&a("div",{class:"v-toolbar__prepend"},[(f=l.prepend)==null?void 0:f.call(l)]),c&&a(kt,{key:"title",text:e.title},{text:l.title}),(u=l.default)==null?void 0:u.call(l),l.append&&a("div",{class:"v-toolbar__append"},[(D=l.append)==null?void 0:D.call(l)])])]}}),a(ne,{defaults:{VTabs:{height:Z(m.value)}}},{default:()=>[a(Ke,null,{default:()=>[d.value&&a("div",{class:"v-toolbar__extension",style:{height:Z(m.value)}},[g])]})]})]})}),{contentHeight:v,extensionHeight:m}}}),Tt=j({scrollTarget:{type:String},scrollThreshold:{type:[String,Number],default:300}},"scroll");function Vt(e){let i=arguments.length>1&&arguments[1]!==void 0?arguments[1]:{};const{canScroll:l}=i;let S=0,t=0;const n=q(null),s=A(0),o=A(0),T=A(0),x=A(!1),d=A(!1),v=h(()=>Number(e.scrollThreshold)),m=h(()=>Qe((v.value-s.value)/v.value||0)),y=()=>{const c=n.value;if(!c||l&&!l.value)return;S=s.value,s.value="window"in c?c.pageYOffset:c.scrollTop;const p=c instanceof Window?document.documentElement.scrollHeight:c.scrollHeight;if(t!==p){t=p;return}d.value=s.value<S,T.value=Math.abs(s.value-v.value)};return L(d,()=>{o.value=o.value||s.value}),L(x,()=>{o.value=0}),re(()=>{L(()=>e.scrollTarget,c=>{var g;const p=c?document.querySelector(c):window;p&&p!==n.value&&((g=n.value)==null||g.removeEventListener("scroll",y),n.value=p,n.value.addEventListener("scroll",y,{passive:!0}))},{immediate:!0})}),ve(()=>{var c;(c=n.value)==null||c.removeEventListener("scroll",y)}),l&&L(l,y,{immediate:!0}),{scrollThreshold:v,currentScroll:s,currentThreshold:T,isScrollActive:x,scrollRatio:m,isScrollingUp:d,savedScroll:o}}const It=j({scrollBehavior:String,modelValue:{type:Boolean,default:!0},location:{type:String,default:"top",validator:e=>["top","bottom"].includes(e)},...qe(),...Ye(),...Tt(),height:{type:[Number,String],default:64}},"VAppBar"),Bt=ee()({name:"VAppBar",props:It(),emits:{"update:modelValue":e=>!0},setup(e,i){let{slots:l}=i;const S=q(),t=ze(e,"modelValue"),n=h(()=>{var u;const f=new Set(((u=e.scrollBehavior)==null?void 0:u.split(" "))??[]);return{hide:f.has("hide"),fullyHide:f.has("fully-hide"),inverted:f.has("inverted"),collapse:f.has("collapse"),elevate:f.has("elevate"),fadeImage:f.has("fade-image")}}),s=h(()=>{const f=n.value;return f.hide||f.fullyHide||f.inverted||f.collapse||f.elevate||f.fadeImage||!t.value}),{currentScroll:o,scrollThreshold:T,isScrollingUp:x,scrollRatio:d}=Vt(e,{canScroll:s}),v=h(()=>n.value.hide||n.value.fullyHide),m=h(()=>e.collapse||n.value.collapse&&(n.value.inverted?d.value>0:d.value===0)),y=h(()=>e.flat||n.value.fullyHide&&!t.value||n.value.elevate&&(n.value.inverted?o.value>0:o.value===0)),c=h(()=>n.value.fadeImage?n.value.inverted?1-d.value:d.value:void 0),p=h(()=>{var D,U;if(n.value.hide&&n.value.inverted)return 0;const f=((D=S.value)==null?void 0:D.contentHeight)??0,u=((U=S.value)==null?void 0:U.extensionHeight)??0;return v.value?o.value<T.value||n.value.fullyHide?f+u:f:f+u});K(h(()=>!!e.scrollBehavior),()=>{$e(()=>{v.value?n.value.inverted?t.value=o.value>T.value:t.value=x.value||o.value<T.value:t.value=!0})});const{ssrBootStyles:g}=Oe(),{layoutItemStyles:P}=We({id:e.name,order:h(()=>parseInt(e.order,10)),position:Q(e,"location"),layoutSize:p,elementSize:A(void 0),active:t,absolute:Q(e,"absolute")});return te(()=>{const f=Ve.filterProps(e);return a(Ve,se({ref:S,class:["v-app-bar",{"v-app-bar--bottom":e.location==="bottom"},e.class],style:[{...P.value,"--v-toolbar-image-opacity":c.value,height:void 0,...g.value},e.style]},f,{collapse:m.value,flat:y.value}),l)}),{}}}),Ct=j({...et({icon:"$menu",variant:"text"})},"VAppBarNavIcon"),Et=ee()({name:"VAppBarNavIcon",props:Ct(),setup(e,i){let{slots:l}=i;return te(()=>a(Xe,se(e,{class:["v-app-bar-nav-icon"]}),l)),{}}});function Nt(e){let{rootEl:i,isSticky:l,layoutItemStyles:S}=e;const t=A(!1),n=A(0),s=h(()=>{const x=typeof t.value=="boolean"?"top":t.value;return[l.value?{top:"auto",bottom:"auto",height:void 0}:void 0,t.value?{[x]:Z(n.value)}:{top:S.value.top}]});re(()=>{L(l,x=>{x?window.addEventListener("scroll",T,{passive:!0}):window.removeEventListener("scroll",T)},{immediate:!0})}),ve(()=>{window.removeEventListener("scroll",T)});let o=0;function T(){const x=o>window.scrollY?"up":"down",d=i.value.getBoundingClientRect(),v=parseFloat(S.value.top??0),m=window.scrollY-Math.max(0,n.value-v),y=d.height+Math.max(n.value,v)-window.scrollY-window.innerHeight,c=parseFloat(getComputedStyle(i.value).getPropertyValue("--v-body-scroll-y"))||0;d.height<window.innerHeight-v?(t.value="top",n.value=v):x==="up"&&t.value==="bottom"||x==="down"&&t.value==="top"?(n.value=window.scrollY+d.top-c,t.value=!0):x==="down"&&y<=0?(n.value=0,t.value="bottom"):x==="up"&&m<=0&&(c?t.value!=="top"&&(n.value=-m+c+v,t.value="top"):(n.value=d.top+m,t.value="top")),o=window.scrollY}return{isStuck:t,stickyStyles:s}}const Mt=100,At=20;function Ie(e){return(e<0?-1:1)*Math.sqrt(Math.abs(e))*1.41421356237}function Be(e){if(e.length<2)return 0;if(e.length===2)return e[1].t===e[0].t?0:(e[1].d-e[0].d)/(e[1].t-e[0].t);let i=0;for(let l=e.length-1;l>0;l--){if(e[l].t===e[l-1].t)continue;const S=Ie(i),t=(e[l].d-e[l-1].d)/(e[l].t-e[l-1].t);i+=(t-S)*Math.abs(t),l===e.length-1&&(i*=.5)}return Ie(i)*1e3}function Pt(){const e={};function i(t){Array.from(t.changedTouches).forEach(n=>{(e[n.identifier]??(e[n.identifier]=new tt(At))).push([t.timeStamp,n])})}function l(t){Array.from(t.changedTouches).forEach(n=>{delete e[n.identifier]})}function S(t){var x;const n=(x=e[t])==null?void 0:x.values().reverse();if(!n)throw new Error(`No samples for touch id ${t}`);const s=n[0],o=[],T=[];for(const d of n){if(s[0]-d[0]>Mt)break;o.push({t:d[0],d:d[1].clientX}),T.push({t:d[0],d:d[1].clientY})}return{x:Be(o),y:Be(T),get direction(){const{x:d,y:v}=this,[m,y]=[Math.abs(d),Math.abs(v)];return m>y&&d>=0?"right":m>y&&d<=0?"left":y>m&&v>=0?"down":y>m&&v<=0?"up":Ht()}}}return{addMovement:i,endTouch:l,getVelocity:S}}function Ht(){throw new Error}function Dt(e){let{el:i,isActive:l,isTemporary:S,width:t,touchless:n,position:s}=e;re(()=>{window.addEventListener("touchstart",f,{passive:!0}),window.addEventListener("touchmove",u,{passive:!1}),window.addEventListener("touchend",D,{passive:!0})}),ve(()=>{window.removeEventListener("touchstart",f),window.removeEventListener("touchmove",u),window.removeEventListener("touchend",D)});const o=h(()=>["left","right"].includes(s.value)),{addMovement:T,endTouch:x,getVelocity:d}=Pt();let v=!1;const m=A(!1),y=A(0),c=A(0);let p;function g(b,w){return(s.value==="left"?b:s.value==="right"?document.documentElement.clientWidth-b:s.value==="top"?b:s.value==="bottom"?document.documentElement.clientHeight-b:F())-(w?t.value:0)}function P(b){let w=arguments.length>1&&arguments[1]!==void 0?arguments[1]:!0;const _=s.value==="left"?(b-c.value)/t.value:s.value==="right"?(document.documentElement.clientWidth-b-c.value)/t.value:s.value==="top"?(b-c.value)/t.value:s.value==="bottom"?(document.documentElement.clientHeight-b-c.value)/t.value:F();return w?Math.max(0,Math.min(1,_)):_}function f(b){if(n.value)return;const w=b.changedTouches[0].clientX,_=b.changedTouches[0].clientY,k=25,B=s.value==="left"?w<k:s.value==="right"?w>document.documentElement.clientWidth-k:s.value==="top"?_<k:s.value==="bottom"?_>document.documentElement.clientHeight-k:F(),I=l.value&&(s.value==="left"?w<t.value:s.value==="right"?w>document.documentElement.clientWidth-t.value:s.value==="top"?_<t.value:s.value==="bottom"?_>document.documentElement.clientHeight-t.value:F());(B||I||l.value&&S.value)&&(p=[w,_],c.value=g(o.value?w:_,l.value),y.value=P(o.value?w:_),v=c.value>-20&&c.value<80,x(b),T(b))}function u(b){const w=b.changedTouches[0].clientX,_=b.changedTouches[0].clientY;if(v){if(!b.cancelable){v=!1;return}const B=Math.abs(w-p[0]),I=Math.abs(_-p[1]);(o.value?B>I&&B>3:I>B&&I>3)?(m.value=!0,v=!1):(o.value?I:B)>3&&(v=!1)}if(!m.value)return;b.preventDefault(),T(b);const k=P(o.value?w:_,!1);y.value=Math.max(0,Math.min(1,k)),k>1?c.value=g(o.value?w:_,!0):k<0&&(c.value=g(o.value?w:_,!1))}function D(b){if(v=!1,!m.value)return;T(b),m.value=!1;const w=d(b.changedTouches[0].identifier),_=Math.abs(w.x),k=Math.abs(w.y);(o.value?_>k&&_>400:k>_&&k>3)?l.value=w.direction===({left:"right",right:"left",top:"down",bottom:"up"}[s.value]||F()):l.value=y.value>.5}const U=h(()=>m.value?{transform:s.value==="left"?`translateX(calc(-100% + ${y.value*t.value}px))`:s.value==="right"?`translateX(calc(100% - ${y.value*t.value}px))`:s.value==="top"?`translateY(calc(-100% + ${y.value*t.value}px))`:s.value==="bottom"?`translateY(calc(100% - ${y.value*t.value}px))`:F(),transition:"none"}:void 0);return K(m,()=>{var _,k;const b=((_=i.value)==null?void 0:_.style.transform)??null,w=((k=i.value)==null?void 0:k.style.transition)??null;$e(()=>{var B,I,O,ae;(I=i.value)==null||I.style.setProperty("transform",((B=U.value)==null?void 0:B.transform)||"none"),(ae=i.value)==null||ae.style.setProperty("transition",((O=U.value)==null?void 0:O.transition)||null)}),at(()=>{var B,I;(B=i.value)==null||B.style.setProperty("transform",b),(I=i.value)==null||I.style.setProperty("transition",w)})}),{isDragging:m,dragProgress:y,dragStyles:U}}function F(){throw new Error}const Rt=["start","end","left","right","top","bottom"],Lt=j({color:String,disableResizeWatcher:Boolean,disableRouteWatcher:Boolean,expandOnHover:Boolean,floating:Boolean,modelValue:{type:Boolean,default:null},permanent:Boolean,rail:{type:Boolean,default:null},railWidth:{type:[Number,String],default:56},scrim:{type:[Boolean,String],default:!0},image:String,temporary:Boolean,persistent:Boolean,touchless:Boolean,width:{type:[Number,String],default:256},location:{type:String,default:"start",validator:e=>Rt.includes(e)},sticky:Boolean,...Ee(),...ce(),...lt(),...ot({mobile:null}),...Ne(),...Ye(),...Me(),...de({tag:"nav"}),...Ae()},"VNavigationDrawer"),Ce=ee()({name:"VNavigationDrawer",props:Lt(),emits:{"update:modelValue":e=>!0,"update:rail":e=>!0},setup(e,i){let{attrs:l,emit:S,slots:t}=i;const{isRtl:n}=Le(),{themeClasses:s}=Re(e),{borderClasses:o}=Pe(e),{backgroundColorClasses:T,backgroundColorStyles:x}=ie(Q(e,"color")),{elevationClasses:d}=He(e),{displayClasses:v,mobile:m}=Fe(e),{roundedClasses:y}=De(e),c=nt(),p=ze(e,"modelValue",null,E=>!!E),{ssrBootStyles:g}=Oe(),{scopeId:P}=st(),f=q(),u=A(!1),{runOpenDelay:D,runCloseDelay:U}=it(e,E=>{u.value=E}),b=h(()=>e.rail&&e.expandOnHover&&u.value?Number(e.width):Number(e.rail?e.railWidth:e.width)),w=h(()=>rt(e.location,n.value)),_=h(()=>e.persistent),k=h(()=>!e.permanent&&(m.value||e.temporary)),B=h(()=>e.sticky&&!k.value&&w.value!=="bottom");K(()=>e.expandOnHover&&e.rail!=null,()=>{L(u,E=>S("update:rail",!E))}),K(()=>!e.disableResizeWatcher,()=>{L(k,E=>!e.permanent&&ct(()=>p.value=!E))}),K(()=>!e.disableRouteWatcher&&!!c,()=>{L(c.currentRoute,()=>k.value&&(p.value=!1))}),L(()=>e.permanent,E=>{E&&(p.value=!0)}),e.modelValue==null&&!k.value&&(p.value=e.permanent||!m.value);const{isDragging:I,dragProgress:O}=Dt({el:f,isActive:p,isTemporary:k,width:b,touchless:Q(e,"touchless"),position:w}),ae=h(()=>{const E=k.value?0:e.rail&&e.expandOnHover?Number(e.railWidth):b.value;return I.value?E*O.value:E}),je=h(()=>["top","bottom"].includes(e.location)?0:b.value),{layoutItemStyles:fe,layoutItemScrimStyles:Ze}=We({id:e.name,order:h(()=>parseInt(e.order,10)),position:w,layoutSize:ae,elementSize:je,active:h(()=>p.value||I.value),disableTransitions:h(()=>I.value),absolute:h(()=>e.absolute||B.value&&typeof me.value!="string")}),{isStuck:me,stickyStyles:Ge}=Nt({rootEl:f,isSticky:B,layoutItemStyles:fe}),ge=ie(h(()=>typeof e.scrim=="string"?e.scrim:null)),Je=h(()=>({...I.value?{opacity:O.value*.2,transition:"none"}:void 0,...Ze.value}));return Ue({VList:{bgColor:"transparent"}}),te(()=>{const E=t.image||e.image;return a(G,null,[a(e.tag,se({ref:f,onMouseenter:D,onMouseleave:U,class:["v-navigation-drawer",`v-navigation-drawer--${w.value}`,{"v-navigation-drawer--expand-on-hover":e.expandOnHover,"v-navigation-drawer--floating":e.floating,"v-navigation-drawer--is-hovering":u.value,"v-navigation-drawer--rail":e.rail,"v-navigation-drawer--temporary":k.value,"v-navigation-drawer--persistent":_.value,"v-navigation-drawer--active":p.value,"v-navigation-drawer--sticky":B.value},s.value,T.value,o.value,v.value,d.value,y.value,e.class],style:[x.value,fe.value,g.value,Ge.value,e.style,["top","bottom"].includes(w.value)?{height:"auto"}:{}]},P,l),{default:()=>{var he,ye,be;return[E&&a("div",{key:"image",class:"v-navigation-drawer__img"},[t.image?a(ne,{key:"image-defaults",disabled:!e.image,defaults:{VImg:{alt:"",cover:!0,height:"inherit",src:e.image}}},t.image):a(J,{key:"image-img",alt:"",cover:!0,height:"inherit",src:e.image},null)]),t.prepend&&a("div",{class:"v-navigation-drawer__prepend"},[(he=t.prepend)==null?void 0:he.call(t)]),a("div",{class:"v-navigation-drawer__content"},[(ye=t.default)==null?void 0:ye.call(t)]),t.append&&a("div",{class:"v-navigation-drawer__append"},[(be=t.append)==null?void 0:be.call(t)])]}}),a(ut,{name:"fade-transition"},{default:()=>[k.value&&(I.value||p.value)&&!!e.scrim&&a("div",se({class:["v-navigation-drawer__scrim",ge.backgroundColorClasses.value],style:[Je.value,ge.backgroundColorStyles.value],onClick:()=>{_.value||(p.value=!1)}},P),null)]})])}),{isStuck:me}}}),Ut={class:"card-blur pt-2 pb-4 px-2"},Yt={style:{"font-size":"17px","font-weight":"600"}},zt={class:"card-blur pt-2 pb-4 px-2"},Ot={style:{"font-size":"17px","font-weight":"600"}},Wt={__name:"default",setup(e){const{mdAndUp:i,xlAndUp:l,name:S}=Fe(),t=q(!0),n=q(!1),s=q(!1),o=vt(),T=ft(),x=mt(),d=[{to:"/profile",text:"個人資料管理",icon:"mdi-account"},{to:"/ITService",text:"IT 維修服務",icon:"mdi-wrench"}],v=[{to:"/user",text:"員工管理",icon:"mdi-account-cog",roles:["SUPER_ADMIN","ADMIN","HR","ACCOUNTANT"]},{to:"/department",text:"公司部門管理",icon:"mdi-office-building-cog",roles:["SUPER_ADMIN","ADMIN"]},{to:"/ITServiceAdmin",text:"IT 維修服務管理",icon:"mdi-wrench-cog",roles:["SUPER_ADMIN","ADMIN","IT"]},{to:"/auditLog",text:"異動紀錄",icon:"mdi-history",roles:["SUPER_ADMIN","ADMIN","IT"]}],m=h(()=>v.filter(p=>p.roles.some(g=>{switch(g){case"SUPER_ADMIN":return o.isSuperAdmin;case"HR":return o.isHR;case"MANAGER":return o.isManager;case"IT":return o.isIT;case"ACCOUNTANT":return o.isAccountant;case"ADMIN":return o.isAdmin;default:return!1}})));L(()=>S.value,p=>{l.value?s.value=!1:i.value&&(s.value=!0)},{immediate:!0});const y=()=>{i.value?s.value=!s.value:n.value=!n.value};re(()=>{l.value?s.value=!1:i.value&&(s.value=!0)});const c=async()=>{await o.logout(),T({text:"登出成功",snackbarProps:{color:"teal-lighten-1"}}),x.push("/login")};return(p,g)=>{const P=pe("router-link"),f=pe("router-view");return N(),R(wt,null,{default:r(()=>[a(Bt,{elevation:"0",border:"b-sm",height:"100",class:"position-fixed"},{default:r(()=>[a(Et,{class:"ms-4",color:"blue-grey-darken-3",onClick:gt(y,["stop"])}),a(P,{to:"/",class:"d-flex"},{default:r(()=>[a(J,{src:_t,width:"170",class:"ms-2 ms-sm-4"})]),_:1}),a(ht),a(Y,{icon:"mdi-email-outline",size:"22",color:"blue-grey-darken-3",class:"me-6"}),a(Y,{icon:"mdi-bell-outline",size:"22",color:"blue-grey-darken-3",class:"me-8"}),V(o).isLogin&&V(i)?(N(),R(Xe,{key:0,"prepend-icon":"mdi-account-arrow-right",variant:"outlined",rounded:"0",color:"blue-grey-darken-2",class:"me-6",onClick:c},{default:r(()=>g[2]||(g[2]=[C(" 登出 ")])),_:1})):H("",!0)]),_:1}),V(i)?(N(),R(Ce,{key:0,modelValue:t.value,"onUpdate:modelValue":g[0]||(g[0]=u=>t.value=u),rail:s.value,permanent:"",class:"position-fixed"},{default:r(()=>[a(Te,{class:"h-100 d-flex flex-column pa-0"},{default:r(()=>[z("div",null,[yt(a(we,{elevation:"0",rounded:"0",height:"172",width:"260",class:"pa-0 card-bg",to:"/profile"},{default:r(()=>[z("div",Ut,[a(_e,{class:"ps-5 pb-3"},{default:r(()=>[a(xe,{size:"48",style:{"box-shadow":"0 0 10px rgba(255,255,255,1)"}},{default:r(()=>[a(J,{src:V(o).avatar},null,8,["src"])]),_:1})]),_:1}),a(ke,{style:{"letter-spacing":"2px",color:"white","line-height":"24px"}},{default:r(()=>[a(Se,null,{default:r(()=>[a(W,{cols:"12",class:"ps-4 pb-0 pt-4"},{default:r(()=>[z("span",Yt,M(V(o).name),1)]),_:1}),a(W,{cols:"12",class:"ps-4 pb-0 pt-0"},{default:r(()=>[C(M(V(o).userId),1)]),_:1}),a(W,{cols:"12",class:"ps-4 pb-0 pt-0"},{default:r(()=>[C(M(V(o).jobTitle),1)]),_:1})]),_:1})]),_:1})])]),_:1},512),[[bt,!s.value]]),V(o).isLogin?(N(),le(G,{key:0},oe(d,u=>a($,{key:u.to,class:"mt-2",color:"blue-grey-darken-3",to:u.to},{prepend:r(()=>[a(Y,null,{default:r(()=>[C(M(u.icon),1)]),_:2},1024)]),default:r(()=>[a(X,null,{default:r(()=>[C(M(u.text),1)]),_:2},1024)]),_:2},1032,["to"])),64)):H("",!0),V(o).isUser?H("",!0):(N(),R(ue,{key:1,color:"blue-grey-darken-4",opacity:"0.3",class:"my-2"})),V(o).isUser?H("",!0):(N(!0),le(G,{key:2},oe(m.value,u=>(N(),R($,{key:u.to,to:u.to,color:"blue-grey-darken-3",class:"mb-2"},{prepend:r(()=>[a(Y,null,{default:r(()=>[C(M(u.icon),1)]),_:2},1024)]),default:r(()=>[a(X,null,{default:r(()=>[C(M(u.text),1)]),_:2},1024)]),_:2},1032,["to"]))),128))]),z("div",null,[V(o).isLogin?H("",!0):(N(),R($,{key:0,to:"/login"},{prepend:r(()=>[a(Y,null,{default:r(()=>g[3]||(g[3]=[C("mdi-account-arrow-left")])),_:1})]),default:r(()=>[a(X,null,{default:r(()=>g[4]||(g[4]=[C("登入")])),_:1})]),_:1}))])]),_:1})]),_:1},8,["modelValue","rail"])):H("",!0),V(i)?H("",!0):(N(),R(Ce,{key:1,modelValue:n.value,"onUpdate:modelValue":g[1]||(g[1]=u=>n.value=u),border:"0",class:"rounded-be-xl position-fixed"},{default:r(()=>[a(Te,{class:"h-100 pa-0"},{default:r(()=>[z("div",null,[a(we,{elevation:"0",rounded:"0",height:"172",class:"pa-0 card-bg",to:"/profile"},{default:r(()=>[z("div",zt,[a(_e,{class:"ps-5 pb-3"},{default:r(()=>[a(xe,{size:"48",style:{"box-shadow":"0 0 10px rgba(255,255,255,1)"}},{default:r(()=>[a(J,{src:V(o).avatar},null,8,["src"])]),_:1})]),_:1}),a(ke,{style:{"letter-spacing":"2px",color:"white","line-height":"24px"}},{default:r(()=>[a(Se,null,{default:r(()=>[a(W,{cols:"12",class:"ps-4 pb-0 pt-4"},{default:r(()=>[z("span",Ot,M(V(o).name),1)]),_:1}),a(W,{cols:"12",class:"ps-4 pb-0 pt-0"},{default:r(()=>[C(M(V(o).userId),1)]),_:1}),a(W,{cols:"12",class:"ps-4 pb-0 pt-0"},{default:r(()=>[C(M(V(o).jobTitle),1)]),_:1})]),_:1})]),_:1})])]),_:1}),V(o).isLogin?(N(),le(G,{key:0},oe(d,u=>a($,{key:u.to,to:u.to,color:"blue-grey-darken-3",class:"mt-4"},{prepend:r(()=>[a(Y,null,{default:r(()=>[C(M(u.icon),1)]),_:2},1024)]),default:r(()=>[a(X,null,{default:r(()=>[C(M(u.text),1)]),_:2},1024)]),_:2},1032,["to"])),64)):H("",!0),V(o).isUser?H("",!0):(N(),R(ue,{key:1,class:"mt-4"})),V(o).isUser?H("",!0):(N(!0),le(G,{key:2},oe(m.value,u=>(N(),R($,{key:u.to,to:u.to,color:"blue-grey-darken-3",class:"mt-4"},{prepend:r(()=>[a(Y,null,{default:r(()=>[C(M(u.icon),1)]),_:2},1024)]),default:r(()=>[a(X,null,{default:r(()=>[C(M(u.text),1)]),_:2},1024)]),_:2},1032,["to"]))),128))]),a(ue,{class:"mt-4"}),z("div",null,[V(o).isLogin?(N(),R($,{key:0,class:"mt-4",color:"blue-grey-darken-3",onClick:c},{prepend:r(()=>[a(Y,null,{default:r(()=>g[5]||(g[5]=[C("mdi-account-arrow-right")])),_:1})]),default:r(()=>[a(X,null,{default:r(()=>g[6]||(g[6]=[C("登出")])),_:1})]),_:1})):H("",!0)])]),_:1})]),_:1},8,["modelValue"])),a(pt,null,{default:r(()=>[a(f)]),_:1})]),_:1})}}},Zt=dt(Wt,[["__scopeId","data-v-7f6d5ad2"]]);export{Zt as default};
