import{p as G,m as de,a as ve,g as ee,u as te,c as t,b as Le,d as fe,e as Ue,f as me,h as se,t as Q,i as Oe,j as ge,k as ze,l as he,n as Ye,s as R,o as b,q as $e,V as le,r as re,v as ae,w as at,x as q,y as lt,z as O,A as ie,B as ye,C as We,D as Xe,E as ne,F as qe,G as Fe,H as F,I as Ge,J as nt,K as je,L as ot,M as rt,N as st,O as it,P as Ze,Q as ut,R as ct,S as dt,T as vt,U as W,W as ft,X as mt,Y as gt,Z as ht,_ as yt,$ as bt,a0 as pt,a1 as wt,a2 as kt,a3 as _t,a4 as xt,a5 as Se,a6 as V,a7 as P,a8 as n,a9 as St,aa as Tt,ab as L,ac as C,ad as T,ae as U,af as $,ag as Vt,ah as At,ai as Te,aj as It,ak as Ve,al as Ae,am as Ie,an as I,ao as X,ap as Z,aq as Ct,ar as Nt}from"./index-BV8bbD0b.js";import{_ as Bt}from"./logo_horizontal-BK2T4LU0.js";import{V as Ce,a as J}from"./VRow-C5j3FJZp.js";import{V as ce}from"./VDivider-BX56lJa1.js";import{V as z,a as Y,b as Ne,c as Be}from"./VList-BU5i68pM.js";const Et=G({text:String,...de(),...ve()},"VToolbarTitle"),Mt=ee()({name:"VToolbarTitle",props:Et(),setup(e,u){let{slots:a}=u;return te(()=>{const x=!!(a.default||a.text||e.text);return t(e.tag,{class:["v-toolbar-title",e.class],style:e.style},{default:()=>{var l;return[x&&t("div",{class:"v-toolbar-title__placeholder"},[a.text?a.text():e.text,(l=a.default)==null?void 0:l.call(a)])]}})}),{}}}),Pt=[null,"prominent","default","comfortable","compact"],Je=G({absolute:Boolean,collapse:Boolean,color:String,density:{type:String,default:"default",validator:e=>Pt.includes(e)},extended:Boolean,extensionHeight:{type:[Number,String],default:48},flat:Boolean,floating:Boolean,height:{type:[Number,String],default:64},image:String,title:String,...Le(),...de(),...fe(),...Ue(),...ve({tag:"header"}),...me()},"VToolbar"),Ee=ee()({name:"VToolbar",props:Je(),setup(e,u){var p;let{slots:a}=u;const{backgroundColorClasses:x,backgroundColorStyles:l}=se(Q(e,"color")),{borderClasses:s}=Oe(e),{elevationClasses:i}=ge(e),{roundedClasses:o}=ze(e),{themeClasses:S}=he(e),{rtlClasses:_}=Ye(),v=R(!!(e.extended||(p=a.extension)!=null&&p.call(a))),c=b(()=>parseInt(Number(e.height)+(e.density==="prominent"?Number(e.height):0)-(e.density==="comfortable"?8:0)-(e.density==="compact"?16:0),10)),g=b(()=>v.value?parseInt(Number(e.extensionHeight)+(e.density==="prominent"?Number(e.extensionHeight):0)-(e.density==="comfortable"?4:0)-(e.density==="compact"?8:0),10):0);return $e({VBtn:{variant:"text"}}),te(()=>{var H;const f=!!(e.title||a.title),k=!!(a.image||e.image),M=(H=a.extension)==null?void 0:H.call(a);return v.value=!!(e.extended||M),t(e.tag,{class:["v-toolbar",{"v-toolbar--absolute":e.absolute,"v-toolbar--collapse":e.collapse,"v-toolbar--flat":e.flat,"v-toolbar--floating":e.floating,[`v-toolbar--density-${e.density}`]:!0},x.value,s.value,i.value,o.value,S.value,_.value,e.class],style:[l.value,e.style]},{default:()=>[k&&t("div",{key:"image",class:"v-toolbar__image"},[a.image?t(re,{key:"image-defaults",disabled:!e.image,defaults:{VImg:{cover:!0,src:e.image}}},a.image):t(le,{key:"image-img",cover:!0,src:e.image},null)]),t(re,{defaults:{VTabs:{height:ae(c.value)}}},{default:()=>{var y,N,A;return[t("div",{class:"v-toolbar__content",style:{height:ae(c.value)}},[a.prepend&&t("div",{class:"v-toolbar__prepend"},[(y=a.prepend)==null?void 0:y.call(a)]),f&&t(Mt,{key:"title",text:e.title},{text:a.title}),(N=a.default)==null?void 0:N.call(a),a.append&&t("div",{class:"v-toolbar__append"},[(A=a.append)==null?void 0:A.call(a)])])]}}),t(re,{defaults:{VTabs:{height:ae(g.value)}}},{default:()=>[t(at,null,{default:()=>[v.value&&t("div",{class:"v-toolbar__extension",style:{height:ae(g.value)}},[M])]})]})]})}),{contentHeight:c,extensionHeight:g}}}),Dt=G({scrollTarget:{type:String},scrollThreshold:{type:[String,Number],default:300}},"scroll");function Ht(e){let u=arguments.length>1&&arguments[1]!==void 0?arguments[1]:{};const{canScroll:a}=u;let x=0,l=0;const s=q(null),i=R(0),o=R(0),S=R(0),_=R(!1),v=R(!1),c=b(()=>Number(e.scrollThreshold)),g=b(()=>lt((c.value-i.value)/c.value||0)),p=()=>{const f=s.value;if(!f||a&&!a.value)return;x=i.value,i.value="window"in f?f.pageYOffset:f.scrollTop;const k=f instanceof Window?document.documentElement.scrollHeight:f.scrollHeight;if(l!==k){l=k;return}v.value=i.value<x,S.value=Math.abs(i.value-c.value)};return O(v,()=>{o.value=o.value||i.value}),O(_,()=>{o.value=0}),ie(()=>{O(()=>e.scrollTarget,f=>{var M;const k=f?document.querySelector(f):window;k&&k!==s.value&&((M=s.value)==null||M.removeEventListener("scroll",p),s.value=k,s.value.addEventListener("scroll",p,{passive:!0}))},{immediate:!0})}),ye(()=>{var f;(f=s.value)==null||f.removeEventListener("scroll",p)}),a&&O(a,p,{immediate:!0}),{scrollThreshold:c,currentScroll:i,currentThreshold:S,isScrollActive:_,scrollRatio:g,isScrollingUp:v,savedScroll:o}}const Rt=G({scrollBehavior:String,modelValue:{type:Boolean,default:!0},location:{type:String,default:"top",validator:e=>["top","bottom"].includes(e)},...Je(),...We(),...Dt(),height:{type:[Number,String],default:64}},"VAppBar"),Lt=ee()({name:"VAppBar",props:Rt(),emits:{"update:modelValue":e=>!0},setup(e,u){let{slots:a}=u;const x=q(),l=Xe(e,"modelValue"),s=b(()=>{var N;const y=new Set(((N=e.scrollBehavior)==null?void 0:N.split(" "))??[]);return{hide:y.has("hide"),fullyHide:y.has("fully-hide"),inverted:y.has("inverted"),collapse:y.has("collapse"),elevate:y.has("elevate"),fadeImage:y.has("fade-image")}}),i=b(()=>{const y=s.value;return y.hide||y.fullyHide||y.inverted||y.collapse||y.elevate||y.fadeImage||!l.value}),{currentScroll:o,scrollThreshold:S,isScrollingUp:_,scrollRatio:v}=Ht(e,{canScroll:i}),c=b(()=>s.value.hide||s.value.fullyHide),g=b(()=>e.collapse||s.value.collapse&&(s.value.inverted?v.value>0:v.value===0)),p=b(()=>e.flat||s.value.fullyHide&&!l.value||s.value.elevate&&(s.value.inverted?o.value>0:o.value===0)),f=b(()=>s.value.fadeImage?s.value.inverted?1-v.value:v.value:void 0),k=b(()=>{var A,w;if(s.value.hide&&s.value.inverted)return 0;const y=((A=x.value)==null?void 0:A.contentHeight)??0,N=((w=x.value)==null?void 0:w.extensionHeight)??0;return c.value?o.value<S.value||s.value.fullyHide?y+N:y:y+N});ne(b(()=>!!e.scrollBehavior),()=>{Ge(()=>{c.value?s.value.inverted?l.value=o.value>S.value:l.value=_.value||o.value<S.value:l.value=!0})});const{ssrBootStyles:M}=qe(),{layoutItemStyles:H}=Fe({id:e.name,order:b(()=>parseInt(e.order,10)),position:Q(e,"location"),layoutSize:k,elementSize:R(void 0),active:l,absolute:Q(e,"absolute")});return te(()=>{const y=Ee.filterProps(e);return t(Ee,F({ref:x,class:["v-app-bar",{"v-app-bar--bottom":e.location==="bottom"},e.class],style:[{...H.value,"--v-toolbar-image-opacity":f.value,height:void 0,...M.value},e.style]},y,{collapse:g.value,flat:p.value}),a)}),{}}}),Ut=G({...nt({icon:"$menu",variant:"text"})},"VAppBarNavIcon"),Ot=ee()({name:"VAppBarNavIcon",props:Ut(),setup(e,u){let{slots:a}=u;return te(()=>t(je,F(e,{class:["v-app-bar-nav-icon"]}),a)),{}}});function zt(e){let{rootEl:u,isSticky:a,layoutItemStyles:x}=e;const l=R(!1),s=R(0),i=b(()=>{const _=typeof l.value=="boolean"?"top":l.value;return[a.value?{top:"auto",bottom:"auto",height:void 0}:void 0,l.value?{[_]:ae(s.value)}:{top:x.value.top}]});ie(()=>{O(a,_=>{_?window.addEventListener("scroll",S,{passive:!0}):window.removeEventListener("scroll",S)},{immediate:!0})}),ye(()=>{window.removeEventListener("scroll",S)});let o=0;function S(){const _=o>window.scrollY?"up":"down",v=u.value.getBoundingClientRect(),c=parseFloat(x.value.top??0),g=window.scrollY-Math.max(0,s.value-c),p=v.height+Math.max(s.value,c)-window.scrollY-window.innerHeight,f=parseFloat(getComputedStyle(u.value).getPropertyValue("--v-body-scroll-y"))||0;v.height<window.innerHeight-c?(l.value="top",s.value=c):_==="up"&&l.value==="bottom"||_==="down"&&l.value==="top"?(s.value=window.scrollY+v.top-f,l.value=!0):_==="down"&&p<=0?(s.value=0,l.value="bottom"):_==="up"&&g<=0&&(f?l.value!=="top"&&(s.value=-g+f+c,l.value="top"):(s.value=v.top+g,l.value="top")),o=window.scrollY}return{isStuck:l,stickyStyles:i}}const Yt=100,$t=20;function Me(e){return(e<0?-1:1)*Math.sqrt(Math.abs(e))*1.41421356237}function Pe(e){if(e.length<2)return 0;if(e.length===2)return e[1].t===e[0].t?0:(e[1].d-e[0].d)/(e[1].t-e[0].t);let u=0;for(let a=e.length-1;a>0;a--){if(e[a].t===e[a-1].t)continue;const x=Me(u),l=(e[a].d-e[a-1].d)/(e[a].t-e[a-1].t);u+=(l-x)*Math.abs(l),a===e.length-1&&(u*=.5)}return Me(u)*1e3}function Wt(){const e={};function u(l){Array.from(l.changedTouches).forEach(s=>{(e[s.identifier]??(e[s.identifier]=new ot($t))).push([l.timeStamp,s])})}function a(l){Array.from(l.changedTouches).forEach(s=>{delete e[s.identifier]})}function x(l){var _;const s=(_=e[l])==null?void 0:_.values().reverse();if(!s)throw new Error(`No samples for touch id ${l}`);const i=s[0],o=[],S=[];for(const v of s){if(i[0]-v[0]>Yt)break;o.push({t:v[0],d:v[1].clientX}),S.push({t:v[0],d:v[1].clientY})}return{x:Pe(o),y:Pe(S),get direction(){const{x:v,y:c}=this,[g,p]=[Math.abs(v),Math.abs(c)];return g>p&&v>=0?"right":g>p&&v<=0?"left":p>g&&c>=0?"down":p>g&&c<=0?"up":Xt()}}}return{addMovement:u,endTouch:a,getVelocity:x}}function Xt(){throw new Error}function qt(e){let{el:u,isActive:a,isTemporary:x,width:l,touchless:s,position:i}=e;ie(()=>{window.addEventListener("touchstart",y,{passive:!0}),window.addEventListener("touchmove",N,{passive:!1}),window.addEventListener("touchend",A,{passive:!0})}),ye(()=>{window.removeEventListener("touchstart",y),window.removeEventListener("touchmove",N),window.removeEventListener("touchend",A)});const o=b(()=>["left","right"].includes(i.value)),{addMovement:S,endTouch:_,getVelocity:v}=Wt();let c=!1;const g=R(!1),p=R(0),f=R(0);let k;function M(m,h){return(i.value==="left"?m:i.value==="right"?document.documentElement.clientWidth-m:i.value==="top"?m:i.value==="bottom"?document.documentElement.clientHeight-m:K())-(h?l.value:0)}function H(m){let h=arguments.length>1&&arguments[1]!==void 0?arguments[1]:!0;const r=i.value==="left"?(m-f.value)/l.value:i.value==="right"?(document.documentElement.clientWidth-m-f.value)/l.value:i.value==="top"?(m-f.value)/l.value:i.value==="bottom"?(document.documentElement.clientHeight-m-f.value)/l.value:K();return h?Math.max(0,Math.min(1,r)):r}function y(m){if(s.value)return;const h=m.changedTouches[0].clientX,r=m.changedTouches[0].clientY,d=25,E=i.value==="left"?h<d:i.value==="right"?h>document.documentElement.clientWidth-d:i.value==="top"?r<d:i.value==="bottom"?r>document.documentElement.clientHeight-d:K(),B=a.value&&(i.value==="left"?h<l.value:i.value==="right"?h>document.documentElement.clientWidth-l.value:i.value==="top"?r<l.value:i.value==="bottom"?r>document.documentElement.clientHeight-l.value:K());(E||B||a.value&&x.value)&&(k=[h,r],f.value=M(o.value?h:r,a.value),p.value=H(o.value?h:r),c=f.value>-20&&f.value<80,_(m),S(m))}function N(m){const h=m.changedTouches[0].clientX,r=m.changedTouches[0].clientY;if(c){if(!m.cancelable){c=!1;return}const E=Math.abs(h-k[0]),B=Math.abs(r-k[1]);(o.value?E>B&&E>3:B>E&&B>3)?(g.value=!0,c=!1):(o.value?B:E)>3&&(c=!1)}if(!g.value)return;m.preventDefault(),S(m);const d=H(o.value?h:r,!1);p.value=Math.max(0,Math.min(1,d)),d>1?f.value=M(o.value?h:r,!0):d<0&&(f.value=M(o.value?h:r,!1))}function A(m){if(c=!1,!g.value)return;S(m),g.value=!1;const h=v(m.changedTouches[0].identifier),r=Math.abs(h.x),d=Math.abs(h.y);(o.value?r>d&&r>400:d>r&&d>3)?a.value=h.direction===({left:"right",right:"left",top:"down",bottom:"up"}[i.value]||K()):a.value=p.value>.5}const w=b(()=>g.value?{transform:i.value==="left"?`translateX(calc(-100% + ${p.value*l.value}px))`:i.value==="right"?`translateX(calc(100% - ${p.value*l.value}px))`:i.value==="top"?`translateY(calc(-100% + ${p.value*l.value}px))`:i.value==="bottom"?`translateY(calc(100% - ${p.value*l.value}px))`:K(),transition:"none"}:void 0);return ne(g,()=>{var r,d;const m=((r=u.value)==null?void 0:r.style.transform)??null,h=((d=u.value)==null?void 0:d.style.transition)??null;Ge(()=>{var E,B,j,oe;(B=u.value)==null||B.style.setProperty("transform",((E=w.value)==null?void 0:E.transform)||"none"),(oe=u.value)==null||oe.style.setProperty("transition",((j=w.value)==null?void 0:j.transition)||null)}),rt(()=>{var E,B;(E=u.value)==null||E.style.setProperty("transform",m),(B=u.value)==null||B.style.setProperty("transition",h)})}),{isDragging:g,dragProgress:p,dragStyles:w}}function K(){throw new Error}const Ft=["start","end","left","right","top","bottom"],Gt=G({color:String,disableResizeWatcher:Boolean,disableRouteWatcher:Boolean,expandOnHover:Boolean,floating:Boolean,modelValue:{type:Boolean,default:null},permanent:Boolean,rail:{type:Boolean,default:null},railWidth:{type:[Number,String],default:56},scrim:{type:[Boolean,String],default:!0},image:String,temporary:Boolean,persistent:Boolean,touchless:Boolean,width:{type:[Number,String],default:256},location:{type:String,default:"start",validator:e=>Ft.includes(e)},sticky:Boolean,...Le(),...de(),...st(),...it({mobile:null}),...fe(),...We(),...Ue(),...ve({tag:"nav"}),...me()},"VNavigationDrawer"),De=ee()({name:"VNavigationDrawer",props:Gt(),emits:{"update:modelValue":e=>!0,"update:rail":e=>!0},setup(e,u){let{attrs:a,emit:x,slots:l}=u;const{isRtl:s}=Ye(),{themeClasses:i}=he(e),{borderClasses:o}=Oe(e),{backgroundColorClasses:S,backgroundColorStyles:_}=se(Q(e,"color")),{elevationClasses:v}=ge(e),{displayClasses:c,mobile:g}=Ze(e),{roundedClasses:p}=ze(e),f=ut(),k=Xe(e,"modelValue",null,D=>!!D),{ssrBootStyles:M}=qe(),{scopeId:H}=ct(),y=q(),N=R(!1),{runOpenDelay:A,runCloseDelay:w}=ft(e,D=>{N.value=D}),m=b(()=>e.rail&&e.expandOnHover&&N.value?Number(e.width):Number(e.rail?e.railWidth:e.width)),h=b(()=>dt(e.location,s.value)),r=b(()=>e.persistent),d=b(()=>!e.permanent&&(g.value||e.temporary)),E=b(()=>e.sticky&&!d.value&&h.value!=="bottom");ne(()=>e.expandOnHover&&e.rail!=null,()=>{O(N,D=>x("update:rail",!D))}),ne(()=>!e.disableResizeWatcher,()=>{O(d,D=>!e.permanent&&mt(()=>k.value=!D))}),ne(()=>!e.disableRouteWatcher&&!!f,()=>{O(f.currentRoute,()=>d.value&&(k.value=!1))}),O(()=>e.permanent,D=>{D&&(k.value=!0)}),e.modelValue==null&&!d.value&&(k.value=e.permanent||!g.value);const{isDragging:B,dragProgress:j}=qt({el:y,isActive:k,isTemporary:d,width:m,touchless:Q(e,"touchless"),position:h}),oe=b(()=>{const D=d.value?0:e.rail&&e.expandOnHover?Number(e.railWidth):m.value;return B.value?D*j.value:D}),Ke=b(()=>["top","bottom"].includes(e.location)?0:m.value),{layoutItemStyles:be,layoutItemScrimStyles:Qe}=Fe({id:e.name,order:b(()=>parseInt(e.order,10)),position:h,layoutSize:oe,elementSize:Ke,active:b(()=>k.value||B.value),disableTransitions:b(()=>B.value),absolute:b(()=>e.absolute||E.value&&typeof pe.value!="string")}),{isStuck:pe,stickyStyles:et}=zt({rootEl:y,isSticky:E,layoutItemStyles:be}),we=se(b(()=>typeof e.scrim=="string"?e.scrim:null)),tt=b(()=>({...B.value?{opacity:j.value*.2,transition:"none"}:void 0,...Qe.value}));return $e({VList:{bgColor:"transparent"}}),te(()=>{const D=l.image||e.image;return t(W,null,[t(e.tag,F({ref:y,onMouseenter:A,onMouseleave:w,class:["v-navigation-drawer",`v-navigation-drawer--${h.value}`,{"v-navigation-drawer--expand-on-hover":e.expandOnHover,"v-navigation-drawer--floating":e.floating,"v-navigation-drawer--is-hovering":N.value,"v-navigation-drawer--rail":e.rail,"v-navigation-drawer--temporary":d.value,"v-navigation-drawer--persistent":r.value,"v-navigation-drawer--active":k.value,"v-navigation-drawer--sticky":E.value},i.value,S.value,o.value,c.value,v.value,p.value,e.class],style:[_.value,be.value,M.value,et.value,e.style,["top","bottom"].includes(h.value)?{height:"auto"}:{}]},H,a),{default:()=>{var ke,_e,xe;return[D&&t("div",{key:"image",class:"v-navigation-drawer__img"},[l.image?t(re,{key:"image-defaults",disabled:!e.image,defaults:{VImg:{alt:"",cover:!0,height:"inherit",src:e.image}}},l.image):t(le,{key:"image-img",alt:"",cover:!0,height:"inherit",src:e.image},null)]),l.prepend&&t("div",{class:"v-navigation-drawer__prepend"},[(ke=l.prepend)==null?void 0:ke.call(l)]),t("div",{class:"v-navigation-drawer__content"},[(_e=l.default)==null?void 0:_e.call(l)]),l.append&&t("div",{class:"v-navigation-drawer__append"},[(xe=l.append)==null?void 0:xe.call(l)])]}}),t(vt,{name:"fade-transition"},{default:()=>[d.value&&(B.value||k.value)&&!!e.scrim&&t("div",F({class:["v-navigation-drawer__scrim",we.backgroundColorClasses.value],style:[tt.value,we.backgroundColorStyles.value],onClick:()=>{r.value||(k.value=!1)}},H),null)]})])}),{isStuck:pe}}}),jt={actions:"button@2",article:"heading, paragraph",avatar:"avatar",button:"button",card:"image, heading","card-avatar":"image, list-item-avatar",chip:"chip","date-picker":"list-item, heading, divider, date-picker-options, date-picker-days, actions","date-picker-options":"text, avatar@2","date-picker-days":"avatar@28",divider:"divider",heading:"heading",image:"image","list-item":"text","list-item-avatar":"avatar, text","list-item-two-line":"sentences","list-item-avatar-two-line":"avatar, sentences","list-item-three-line":"paragraph","list-item-avatar-three-line":"avatar, paragraph",ossein:"ossein",paragraph:"text@3",sentences:"text@2",subtitle:"text",table:"table-heading, table-thead, table-tbody, table-tfoot","table-heading":"chip, text","table-thead":"heading@6","table-tbody":"table-row-divider@6","table-row-divider":"table-row, divider","table-row":"text@6","table-tfoot":"text@2, avatar@2",text:"text"};function Zt(e){let u=arguments.length>1&&arguments[1]!==void 0?arguments[1]:[];return t("div",{class:["v-skeleton-loader__bone",`v-skeleton-loader__${e}`]},[u])}function He(e){const[u,a]=e.split("@");return Array.from({length:a}).map(()=>ue(u))}function ue(e){let u=[];if(!e)return u;const a=jt[e];if(e!==a){if(e.includes(","))return Re(e);if(e.includes("@"))return He(e);a.includes(",")?u=Re(a):a.includes("@")?u=He(a):a&&u.push(ue(a))}return[Zt(e,u)]}function Re(e){return e.replace(/\s/g,"").split(",").map(ue)}const Jt=G({boilerplate:Boolean,color:String,loading:Boolean,loadingText:{type:String,default:"$vuetify.loading"},type:{type:[String,Array],default:"ossein"},...gt(),...fe(),...me()},"VSkeletonLoader"),Kt=ee()({name:"VSkeletonLoader",props:Jt(),setup(e,u){let{slots:a}=u;const{backgroundColorClasses:x,backgroundColorStyles:l}=se(Q(e,"color")),{dimensionStyles:s}=ht(e),{elevationClasses:i}=ge(e),{themeClasses:o}=he(e),{t:S}=yt(),_=b(()=>ue(bt(e.type).join(",")));return te(()=>{var g;const v=!a.default||e.loading,c=e.boilerplate||!v?{}:{ariaLive:"polite",ariaLabel:S(e.loadingText),role:"alert"};return t("div",F({class:["v-skeleton-loader",{"v-skeleton-loader--boilerplate":e.boilerplate},o.value,x.value,i.value],style:[l.value,v?s.value:{}]},c),[v?_.value:(g=a.default)==null?void 0:g.call(a)])}),{}}}),Qt=""+new URL("bg_profile_robot-BEsTABuI.png",import.meta.url).href,ea={class:"card-blur pt-2 pb-4 px-2"},ta={style:{"font-size":"17px","font-weight":"600"}},aa={class:"card-blur pt-2 pb-4 px-2"},la={style:{"font-size":"17px","font-weight":"600"}},na={__name:"default",setup(e){const{mdAndUp:u,xlAndUp:a,name:x}=Ze(),l=q(!0),s=q(!1),i=q(!1),o=wt(),S=kt(),_=_t(),v=xt(),c=q([]),g=q(!1),p=()=>{g.value=!0},f=A=>{c.value.includes(A)?c.value=c.value.filter(w=>w!==A):c.value.push(A)},k=[{to:"/profile",text:"個人資料管理",icon:"mdi-account"},{to:"/ITService",text:"IT 維修服務",icon:"mdi-wrench"}],M=[{text:"人事管理",icon:"mdi-account-group",roles:["SUPER_ADMIN","ADMIN","HR","ACCOUNTANT"],children:[{to:"/user",text:"員工管理",icon:"mdi-account-cog",roles:["SUPER_ADMIN","ADMIN","HR","ACCOUNTANT"]},{to:"/tempUser",text:"招聘資料管理",icon:"mdi-account-clock",roles:["SUPER_ADMIN","ADMIN","HR","ACCOUNTANT"]}]},{to:"/department",text:"公司部門管理",icon:"mdi-office-building-cog",roles:["SUPER_ADMIN","ADMIN"]},{to:"/ITServiceAdmin",text:"IT 維修服務管理",icon:"mdi-wrench-cog",roles:["SUPER_ADMIN","ADMIN","IT"]},{to:"/auditLog",text:"異動紀錄",icon:"mdi-history",roles:["SUPER_ADMIN","ADMIN","IT"]}],H=b(()=>M.filter(A=>{const w=A.roles.some(m=>{switch(m){case"SUPER_ADMIN":return o.isSuperAdmin;case"HR":return o.isHR;case"MANAGER":return o.isManager;case"IT":return o.isIT;case"ACCOUNTANT":return o.isAccountant;case"ADMIN":return o.isAdmin;default:return!1}});return A.children?(A.children=A.children.filter(m=>m.roles.some(h=>{switch(h){case"SUPER_ADMIN":return o.isSuperAdmin;case"HR":return o.isHR;case"MANAGER":return o.isManager;case"IT":return o.isIT;case"ACCOUNTANT":return o.isAccountant;case"ADMIN":return o.isAdmin;default:return!1}})),w&&A.children.length>0):w}));O(()=>v.path,()=>{c.value=[]}),O(()=>x.value,A=>{a.value?i.value=!1:u.value&&(i.value=!0)},{immediate:!0});const y=()=>{u.value?i.value=!i.value:s.value=!s.value};ie(()=>{a.value?i.value=!1:u.value&&(i.value=!0)});const N=async()=>{await o.logout(),S({text:"登出成功",snackbarProps:{color:"teal-lighten-1"}}),_.push("/login")};return(A,w)=>{const m=Se("router-link"),h=Se("router-view");return V(),P(Nt,null,{default:n(()=>[t(Lt,{elevation:"0",border:"b-sm",height:"100",class:"position-fixed"},{default:n(()=>[t(Ot,{class:"ms-4",color:"blue-grey-darken-3",onClick:St(y,["stop"])}),t(m,{to:"/",class:"d-flex"},{default:n(()=>[t(le,{src:Bt,width:"170",class:"ms-2 ms-sm-4"})]),_:1}),t(Tt),t(L,{icon:"mdi-email-outline",size:"22",color:"blue-grey-darken-3",class:"me-6"}),t(L,{icon:"mdi-bell-outline",size:"22",color:"blue-grey-darken-3",class:"me-8"}),C(o).isLogin&&C(u)?(V(),P(je,{key:0,"prepend-icon":"mdi-account-arrow-right",variant:"outlined",rounded:"0",color:"blue-grey-darken-2",class:"me-6",onClick:N},{default:n(()=>w[2]||(w[2]=[T(" 登出 ")])),_:1})):U("",!0)]),_:1}),C(u)?(V(),P(De,{key:0,modelValue:l.value,"onUpdate:modelValue":w[0]||(w[0]=r=>l.value=r),rail:i.value,permanent:"","expand-on-hover":i.value,class:"position-fixed"},{default:n(()=>[t(Ne,{class:"h-100 d-flex flex-column pa-0"},{default:n(()=>[$("div",null,[Vt(t(Te,{elevation:"0",rounded:"0",height:"172",width:"260",class:It(["pa-0 card-bg position-relative",{loaded:g.value}]),to:"/profile"},{default:n(()=>[g.value?U("",!0):(V(),P(Kt,{key:0,class:"position-absolute w-100 h-100 pa-0 ma-0"})),$("img",{src:Qt,alt:"background",style:{display:"none"},onLoad:p},null,32),$("div",ea,[t(Ve,{class:"ps-5 pb-3"},{default:n(()=>[t(Ae,{size:"48",style:{"box-shadow":"0 0 10px rgba(255,255,255,1)"}},{default:n(()=>[t(le,{src:C(o).avatar},null,8,["src"])]),_:1})]),_:1}),t(Ie,{style:{"letter-spacing":"2px",color:"white","line-height":"24px"}},{default:n(()=>[t(Ce,null,{default:n(()=>[t(J,{cols:"12",class:"ps-4 pb-0 pt-4"},{default:n(()=>[$("span",ta,I(C(o).name),1)]),_:1}),t(J,{cols:"12",class:"ps-4 pb-0 pt-0"},{default:n(()=>[T(I(C(o).userId),1)]),_:1}),t(J,{cols:"12",class:"ps-4 pb-0 pt-0"},{default:n(()=>[T(I(C(o).jobTitle),1)]),_:1})]),_:1})]),_:1})])]),_:1},8,["class"]),[[At,!i.value]]),C(o).isLogin?(V(),X(W,{key:0},Z(k,r=>t(z,{key:r.to,class:"mt-2",color:"blue-grey-darken-3",to:r.to},{prepend:n(()=>[t(L,null,{default:n(()=>[T(I(r.icon),1)]),_:2},1024)]),default:n(()=>[t(Y,null,{default:n(()=>[T(I(r.text),1)]),_:2},1024)]),_:2},1032,["to"])),64)):U("",!0),C(o).isUser?U("",!0):(V(),P(ce,{key:1,color:"blue-grey-darken-4",opacity:"0.3",class:"my-2"})),C(o).isUser?U("",!0):(V(!0),X(W,{key:2},Z(H.value,r=>(V(),X(W,{key:r.text},[r.children?(V(),P(Be,{key:0,value:c.value.includes(r.text),onClick:d=>f(r.text)},{activator:n(({props:d})=>[t(z,F({ref_for:!0},d,{color:"blue-grey-darken-3"}),{prepend:n(()=>[t(L,null,{default:n(()=>[T(I(r.icon),1)]),_:2},1024)]),default:n(()=>[t(Y,null,{default:n(()=>[T(I(r.text),1)]),_:2},1024)]),_:2},1040)]),default:n(()=>[(V(!0),X(W,null,Z(r.children,d=>(V(),P(z,{key:d.to,to:d.to,color:"blue-grey-darken-3"},{prepend:n(()=>[t(L,null,{default:n(()=>[T(I(d.icon),1)]),_:2},1024)]),default:n(()=>[t(Y,null,{default:n(()=>[T(I(d.text),1)]),_:2},1024)]),_:2},1032,["to"]))),128))]),_:2},1032,["value","onClick"])):(V(),P(z,{key:1,to:r.to,color:"blue-grey-darken-3",class:"mt-2"},{prepend:n(()=>[t(L,null,{default:n(()=>[T(I(r.icon),1)]),_:2},1024)]),default:n(()=>[t(Y,null,{default:n(()=>[T(I(r.text),1)]),_:2},1024)]),_:2},1032,["to"]))],64))),128))]),$("div",null,[C(o).isLogin?U("",!0):(V(),P(z,{key:0,to:"/login"},{prepend:n(()=>[t(L,null,{default:n(()=>w[3]||(w[3]=[T("mdi-account-arrow-left")])),_:1})]),default:n(()=>[t(Y,null,{default:n(()=>w[4]||(w[4]=[T("登入")])),_:1})]),_:1}))])]),_:1})]),_:1},8,["modelValue","rail","expand-on-hover"])):U("",!0),C(u)?U("",!0):(V(),P(De,{key:1,modelValue:s.value,"onUpdate:modelValue":w[1]||(w[1]=r=>s.value=r),border:"0",class:"rounded-be-xl position-fixed"},{default:n(()=>[t(Ne,{class:"h-100 pa-0 overflow-auto"},{default:n(()=>[$("div",null,[t(Te,{elevation:"0",rounded:"0",height:"172",class:"pa-0 card-bg",to:"/profile"},{default:n(()=>[$("div",aa,[t(Ve,{class:"ps-5 pb-3"},{default:n(()=>[t(Ae,{size:"48",style:{"box-shadow":"0 0 10px rgba(255,255,255,1)"}},{default:n(()=>[t(le,{src:C(o).avatar},null,8,["src"])]),_:1})]),_:1}),t(Ie,{style:{"letter-spacing":"2px",color:"white","line-height":"24px"}},{default:n(()=>[t(Ce,null,{default:n(()=>[t(J,{cols:"12",class:"ps-4 pb-0 pt-4"},{default:n(()=>[$("span",la,I(C(o).name),1)]),_:1}),t(J,{cols:"12",class:"ps-4 pb-0 pt-0"},{default:n(()=>[T(I(C(o).userId),1)]),_:1}),t(J,{cols:"12",class:"ps-4 pb-0 pt-0"},{default:n(()=>[T(I(C(o).jobTitle),1)]),_:1})]),_:1})]),_:1})])]),_:1}),C(o).isLogin?(V(),X(W,{key:0},Z(k,r=>t(z,{key:r.to,to:r.to,color:"blue-grey-darken-3",class:"mt-4"},{prepend:n(()=>[t(L,null,{default:n(()=>[T(I(r.icon),1)]),_:2},1024)]),default:n(()=>[t(Y,null,{default:n(()=>[T(I(r.text),1)]),_:2},1024)]),_:2},1032,["to"])),64)):U("",!0),C(o).isUser?U("",!0):(V(),P(ce,{key:1,class:"mt-4"})),C(o).isUser?U("",!0):(V(!0),X(W,{key:2},Z(H.value,r=>(V(),X(W,{key:r.text},[r.children?(V(),P(Be,{key:0},{activator:n(({props:d})=>[t(z,F({ref_for:!0},d,{color:"blue-grey-darken-3"}),{prepend:n(()=>[t(L,null,{default:n(()=>[T(I(r.icon),1)]),_:2},1024)]),default:n(()=>[t(Y,null,{default:n(()=>[T(I(r.text),1)]),_:2},1024)]),_:2},1040)]),default:n(()=>[(V(!0),X(W,null,Z(r.children,d=>(V(),P(z,{key:d.to,to:d.to,color:"blue-grey-darken-3"},{prepend:n(()=>[t(L,null,{default:n(()=>[T(I(d.icon),1)]),_:2},1024)]),default:n(()=>[t(Y,null,{default:n(()=>[T(I(d.text),1)]),_:2},1024)]),_:2},1032,["to"]))),128))]),_:2},1024)):(V(),P(z,{key:1,to:r.to,color:"blue-grey-darken-3",class:"mt-2"},{prepend:n(()=>[t(L,null,{default:n(()=>[T(I(r.icon),1)]),_:2},1024)]),default:n(()=>[t(Y,null,{default:n(()=>[T(I(r.text),1)]),_:2},1024)]),_:2},1032,["to"]))],64))),128))]),t(ce,{class:"mt-4"}),$("div",null,[C(o).isLogin?(V(),P(z,{key:0,class:"mt-4",color:"blue-grey-darken-3",onClick:N},{prepend:n(()=>[t(L,null,{default:n(()=>w[5]||(w[5]=[T("mdi-account-arrow-right")])),_:1})]),default:n(()=>[t(Y,null,{default:n(()=>w[6]||(w[6]=[T("登出")])),_:1})]),_:1})):U("",!0)])]),_:1})]),_:1},8,["modelValue"])),t(Ct,null,{default:n(()=>[t(h)]),_:1})]),_:1})}}},ca=pt(na,[["__scopeId","data-v-35f4dae2"]]);export{ca as default};