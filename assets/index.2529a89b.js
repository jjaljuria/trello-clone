var P=Object.defineProperty;var C=Object.getOwnPropertySymbols;var j=Object.prototype.hasOwnProperty,$=Object.prototype.propertyIsEnumerable;var L=(a,e,t)=>e in a?P(a,e,{enumerable:!0,configurable:!0,writable:!0,value:t}):a[e]=t,D=(a,e)=>{for(var t in e||(e={}))j.call(e,t)&&L(a,t,e[t]);if(C)for(var t of C(e))$.call(e,t)&&L(a,t,e[t]);return a};var O=(a,e,t)=>(L(a,typeof e!="symbol"?e+"":e,t),t),S=(a,e,t)=>{if(!e.has(a))throw TypeError("Cannot "+t)};var n=(a,e,t)=>(S(a,e,"read from private field"),t?t.call(a):e.get(a)),l=(a,e,t)=>{if(e.has(a))throw TypeError("Cannot add the same private member more than once");e instanceof WeakSet?e.add(a):e.set(a,t)},u=(a,e,t,s)=>(S(a,e,"write to private field"),s?s.call(a,t):e.set(a,t),t);var d=(a,e,t)=>(S(a,e,"access private method"),t);const B=function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const r of document.querySelectorAll('link[rel="modulepreload"]'))s(r);new MutationObserver(r=>{for(const i of r)if(i.type==="childList")for(const c of i.addedNodes)c.tagName==="LINK"&&c.rel==="modulepreload"&&s(c)}).observe(document,{childList:!0,subtree:!0});function t(r){const i={};return r.integrity&&(i.integrity=r.integrity),r.referrerpolicy&&(i.referrerPolicy=r.referrerpolicy),r.crossorigin==="use-credentials"?i.credentials="include":r.crossorigin==="anonymous"?i.credentials="omit":i.credentials="same-origin",i}function s(r){if(r.ep)return;r.ep=!0;const i=t(r);fetch(r.href,i)}};B();var o,v;class V{constructor(e){l(this,o,[]);l(this,v,null);u(this,v,e)}set data(e){if(!Array.isArray(e))throw new Error("typeError: Data need array");const t=[];e.forEach(s=>t.push(s)),u(this,o,t)}add(e){n(this,o).push(D({},e))}find(e){return e?n(this,o).find(t=>t.id===e):null}getAll(){return[...n(this,o)]}indexOf(e){return n(this,o).findIndex(t=>t.id===e)}insert(e,t){try{n(this,o).splice(e,0,t)}catch{return!1}return!0}remove(e){const t=n(this,o).findIndex(s=>s.id===e);return t===-1?!1:(n(this,o).splice(t,1),!0)}removeDeleted(){u(this,o,n(this,o).filter(e=>!e.deleted))}update(e){const t=n(this,o).findIndex(s=>s.id===e.id);return t!==-1?(n(this,o)[t]=e,!0):!1}save(){n(this,v).save()}}o=new WeakMap,v=new WeakMap;var f,g;class F{constructor(e){l(this,f,[]);l(this,g,null);O(this,"length",0);u(this,g,e)}attach(){const e=new V(this);return n(this,f)[this.length]=e,this.length+=1,e}save(){const e=n(this,f).map(t=>t.getAll());n(this,g).setItem("data",JSON.stringify(e))}populate(){const e=JSON.parse(n(this,g).getItem("data"));if(!!Array.isArray(e))for(let t=0;t<e.length;t+=1)for(let s=0;s<e[t].length;s+=1)n(this,f)[t].add(e[t][s])}}f=new WeakMap,g=new WeakMap;const I=new F(localStorage);function q(a){const e=a.target;e.contentEditable=!0}var b,y,w,N;class M extends HTMLElement{constructor(t){super(t);l(this,w);l(this,b,"adfs");l(this,y,"dsfgds");this.attachShadow({mode:"open"}),this.render(),this.titleElem.addEventListener("click",q),this.titleElem.addEventListener("blur",s=>this.saveText(s,"title")),this.bodyElem.addEventListener("blur",s=>this.saveText(s,"body")),this.bodyElem.addEventListener("click",q),this.deleteButton.addEventListener("click",this.deleteTask.bind(this))}deleteTask(){const t=new CustomEvent("deleteTask",{detail:{id:this.id}});this.dispatchEvent(t)}saveText(t,s){const r=new CustomEvent("textChange",{detail:{id:this.dataset.id,attr:s,text:t.target.innerText},composed:!0});this[s]=t.target.innerText,t.target.contentEditable=!1,this.dispatchEvent(r)}set body(t){u(this,b,t),this.setAttribute("body",t)}get body(){return n(this,b)}set title(t){u(this,y,t),this.setAttribute("title",t)}get title(){return n(this,y)}static get observedAttributes(){return["title","body","id"]}attributeChangedCallback(t,s,r){switch(t){case"title":this.titleElem.innerText=r||"";break;case"body":this.bodyElem.innerText=r||"";break;case"id":this.dataset.id=r||"";break}}render(){this.shadowRoot.innerHTML=`
			${d(this,w,N).call(this)}
			<div class="task" draggable="true" data-id="${this.dataset.id}">
			<header class="task__header">
				<div class="task__title">
				</div>
				<div class="task__icon">
					<button class="task__icon-delete">x</button>
				</div>
			</header>
			<hr>
			<section class="task__body">
			</section>
		</div>
		`,this.titleElem=this.shadowRoot.querySelector(".task__title"),this.bodyElem=this.shadowRoot.querySelector(".task__body"),this.deleteButton=this.shadowRoot.querySelector(".task__icon-delete")}}b=new WeakMap,y=new WeakMap,w=new WeakSet,N=function(){return`
		<style>
		.task {
			display: block;
			background-color: var(--color-primary);
			width: calc(100% - 1rem);
			margin: auto;
			word-break: break-word;
		}

		.task hr {
			border: 0;
			border-top: 1px solid #777;
			margin-left: 4px;
			margin-right: 4px;
		}

		.task__header {
			display: flex;
			word-break: break-word;
			padding: 5px;
			gap: 2px
		}

		.task__title {
			width: 100%;
			outline: none;
			word-wrap: break-word;
		}

		.task__icon {
			display: flex;
			gap: 2px;
			align-items: start;
		}

		.task__body {
			min-height: 5rem;
			word-wrap: break-word;
			padding: 5px;
			outline: none;
		}
		</style>
		`};customElements.define("task-item",M);function G(a,e){const t=Math.ceil(a),s=Math.floor(e);return Math.floor(Math.random()*(s-t+1)+t).toString()}var p,k,h,m,x,R,T,J;class K extends HTMLElement{constructor(){super();l(this,p);l(this,h);l(this,x);l(this,T);this.tasks=I.attach(),this.render()}newTask(){const t={title:"",body:"",id:G(1,1e8)},s=this.querySelector(".task__container task-separator"),r=d(this,p,k).call(this,t),i=d(this,h,m).call(this);s.insertAdjacentElement("afterend",r),r.after(i),this.tasks.insert(0,t),this.tasks.save()}dragTask(t){const{dataTransfer:s,target:r}=t,i={id:r.dataset.id,title:r.title,body:r.body};s.effectAllowed="move",s.setData("text",JSON.stringify(i)),i.deleted=!0,this.tasks.update(i)}removeTaskDroped(t){t.dataTransfer.dropEffect!=="none"&&(this.tasks.removeDeleted(),this.tasks.save(),this.render())}render(){this.innerHTML=`
		<section class="column">
			<p class="new_task">
				Create Task
			</p>
			<div class="task__container">
			</div>
		</section>`,this.querySelector(".new_task").addEventListener("click",this.newTask.bind(this)),this.querySelectorAll(".task__container").forEach(s=>{s.appendChild(d(this,h,m).call(this)),s.addEventListener("dragover",r=>{r.target.classList.contains("task__container")&&r.preventDefault()}),s.addEventListener("drop",r=>{if(r.dataTransfer.effectAllowed==="move"){const i=JSON.parse(r.dataTransfer.getData("text")),c=d(this,p,k).call(this,i,s),E=d(this,h,m).call(this);s.appendChild(c),s.appendChild(E),this.tasks.add(i),this.tasks.save()}})}),this.tasks.getAll().forEach(s=>{const r=this.querySelector(".task__container"),i=d(this,p,k).call(this,s),c=d(this,h,m).call(this,r);r.appendChild(i),r.appendChild(c)})}}p=new WeakSet,k=function({id:t,title:s,body:r}){const i=document.createElement("task-item",{is:M});return i.setAttribute("id",t),i.title=s,i.body=r,i.addEventListener("dragstart",this.dragTask.bind(this)),i.addEventListener("dragend",this.removeTaskDroped.bind(this)),i.addEventListener("textChange",d(this,T,J).bind(this)),i.addEventListener("deleteTask",d(this,x,R).bind(this,t)),i},h=new WeakSet,m=function(){const t=document.createElement("task-separator");return t.addEventListener("dropTask",s=>{var A;s.stopPropagation();const{task:r}=s.detail,i=d(this,p,k).call(this,r),c=d(this,h,m).call(this);s.target.insertAdjacentElement("afterend",i),i.insertAdjacentElement("afterend",c);const E=(A=s.target.previousElementSibling)==null?void 0:A.id;if(!E)this.tasks.insert(0,r);else{const H=this.tasks.indexOf(E);this.tasks.insert(H+1,r)}this.tasks.save()}),t},x=new WeakSet,R=function(t){this.tasks.remove(t),this.tasks.save(),this.render()},T=new WeakSet,J=function(t){const{id:s,text:r,attr:i}=t.detail,c=this.tasks.find(s);c[i]=r,this.tasks.update(c),this.tasks.save()};customElements.define("task-column",K);var _,z;class W extends HTMLElement{constructor(t){super(t);l(this,_);this.attachShadow({mode:"open"}),this.addEventListener("dragenter",()=>{this.shadowRoot.querySelector(".separator").classList.toggle("space",!0)}),this.addEventListener("dragleave",()=>{this.shadowRoot.querySelector(".separator").classList.toggle("space",!1)}),this.addEventListener("dragover",s=>{s.preventDefault()}),this.addEventListener("drop",s=>{if(s.stopPropagation(),s.dataTransfer.effectAllowed==="move"){const r=JSON.parse(s.dataTransfer.getData("text"));this.shadowRoot.querySelector(".separator").classList.toggle("space",!1);const i=new CustomEvent("dropTask",{detail:{task:r},composed:!0});this.dispatchEvent(i)}}),this.render()}render(){this.shadowRoot.innerHTML=`
			${d(this,_,z).call(this)}
			<div class="separator"></div>
		`}}_=new WeakSet,z=function(){return`
			<style>
			.separator {
				box-sizing: border-box;
				padding: 1rem;
			}
			.space {
				width: 100%;
				height: 8rem;
			}

			</style>
		`};customElements.define("task-separator",W);function Q(a){const e=a.target.value;return e?(localStorage.setItem("title",JSON.stringify(e)),!0):!1}function U(){const a=localStorage.getItem("title");return a?JSON.parse(a):""}window.addEventListener("DOMContentLoaded",()=>{I.populate(),document.querySelectorAll("task-column").forEach(a=>a.render()),document.querySelector(".title > input").value=U(),document.querySelector(".title > input").onblur=Q});
