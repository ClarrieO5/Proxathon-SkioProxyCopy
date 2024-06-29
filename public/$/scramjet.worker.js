(()=>{var E,P=new Uint8Array(16);function R(){if(!E&&(E=typeof crypto<"u"&&crypto.getRandomValues&&crypto.getRandomValues.bind(crypto),!E))throw new Error("crypto.getRandomValues() not supported. See https://github.com/uuidjs/uuid#getrandomvalues-not-supported");return E(P)}var d=[];for(let t=0;t<256;++t)d.push((t+256).toString(16).slice(1));function N(t,e=0){return d[t[e+0]]+d[t[e+1]]+d[t[e+2]]+d[t[e+3]]+"-"+d[t[e+4]]+d[t[e+5]]+"-"+d[t[e+6]]+d[t[e+7]]+"-"+d[t[e+8]]+d[t[e+9]]+"-"+d[t[e+10]]+d[t[e+11]]+d[t[e+12]]+d[t[e+13]]+d[t[e+14]]+d[t[e+15]]}var _=typeof crypto<"u"&&crypto.randomUUID&&crypto.randomUUID.bind(crypto),O={randomUUID:_};function I(t,e,r){if(O.randomUUID&&!e&&!t)return O.randomUUID();t=t||{};let n=t.random||(t.rng||R)();if(n[6]=n[6]&15|64,n[8]=n[8]&63|128,e){r=r||0;for(let o=0;o<16;++o)e[r+o]=n[o];return e}return N(n)}var C=I;var W=20,M=globalThis.fetch,g=globalThis.WebSocket,$=globalThis.Request,k=globalThis.Response,m={prototype:{send:g.prototype.send},CLOSED:g.CLOSED,CLOSING:g.CLOSING,CONNECTING:g.CONNECTING,OPEN:g.OPEN};var w;"ServiceWorkerGlobalScope"in self&&addEventListener("message",async({data:t})=>{if(t.type==="response"){let e=w.promises.get(t.id);e.resolve&&(e.resolve(t),w.promises.delete(t.id))}else if(t.type==="error"){let e=w.promises.get(t.id);e.reject&&(e.reject(t.error),w.promises.delete(t.id))}});var U=class{canstart=!0;ready=!1;promises=new Map;constructor(){if(!("ServiceWorkerGlobalScope"in self))throw new TypeError("Attempt to construct RemoteClient from outside a service worker")}async init(){w=this,this.ready=!0}async meta(){}async request(e,r,n,o,c){let h=C(),a=await self.clients.matchAll();if(a.length<1)throw new Error("no available clients");for(let u of a)u.postMessage({type:"request",id:h,remote:e.toString(),method:r,body:n,headers:o});return await new Promise((u,i)=>{this.promises.set(h,{resolve:u,reject:i})})}connect(e,r,n,o,c,h,a,u){throw"why are you calling connect from remoteclient"}};self.BCC_VERSION="1.1.1";console.debug("BARE_MUX_VERSION: "+self.BCC_VERSION);function D(t,e){let r=new((0,eval)(t))(...e);return r.initpromise=r.init(),r}var b=class{active=null;channel=new BroadcastChannel("bare-mux");data=null;constructor(){this.channel.addEventListener("message",({data:{type:e,data:r}})=>{switch(console.log(`bare-mux: ${e}`,r,`${"ServiceWorker"in globalThis}`),e){case"setremote":this.active=new U;break;case"set":let{name:n,config:o}=r;this.active=D(n,o);break;case"find":this.data&&this.channel.postMessage(this.data);break}})}};function T(){if("ServiceWorkerGlobalScope"in globalThis&&globalThis.gSwitcher&&!globalThis.gSwitcher.active&&globalThis.gSwitcher.channel.postMessage({type:"find"}),globalThis.gSwitcher)return globalThis.gSwitcher;if("ServiceWorkerGlobalScope"in globalThis)return globalThis.gSwitcher=new b,globalThis.gSwitcher.channel.postMessage({type:"find"}),globalThis.gSwitcher;let t=window;for(let e=0;e<20;e++)try{if(t==t.parent)return globalThis.gSwitcher=new b,globalThis.gSwitcher;if(t=t.parent,t&&t.gSwitcher)return console.debug("Found implementation on parent"),globalThis.gSwitcher=t.gSwitcher,t.gSwitcher}catch{return globalThis.gSwitcher=new b,globalThis.gSwitcher.channel.postMessage({type:"find"}),globalThis.gSwitcher}throw"unreachable"}T();var F="!#$%&'*+-.0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ^_`abcdefghijklmnopqrstuvwxyz|~";function G(t){for(let e=0;e<t.length;e++){let r=t[e];if(!F.includes(r))return!1}return!0}Object.getOwnPropertyDescriptor(g.prototype,"readyState").get;var H=["ws:","wss:"],B=[101,204,205,304],A=[301,302,303,307,308],x=class{constructor(){}createWebSocket(e,r=[],n,o,c){let a=T().active;if(!a)throw"invalid switcher";if(!a.ready)throw new TypeError("You need to wait for the client to finish fetching the manifest before creating any WebSockets. Try caching the manifest data before making this request.");try{e=new URL(e)}catch{throw new DOMException(`Faiiled to construct 'WebSocket': The URL '${e}' is invalid.`)}if(!H.includes(e.protocol))throw new DOMException(`Failed to construct 'WebSocket': The URL's scheme must be either 'ws' or 'wss'. '${e.protocol}' is not allowed.`);Array.isArray(r)||(r=[r]),r=r.map(String);for(let s of r)if(!G(s))throw new DOMException(`Failed to construct 'WebSocket': The subprotocol '${s}' is invalid.`);let u=n||g,i=new u("ws://127.0.0.1:1",r),f="",l=m.CONNECTING,p=!1;i.addEventListener("error",s=>{p||(l=g.CONNECTING,s.stopImmediatePropagation(),p=!0)});let y=!1;i.addEventListener("close",s=>{y||(s.stopImmediatePropagation(),y=!0)}),c=c||n.constructor.constructor("return ArrayBuffer")().prototype,o.Host=new URL(e).host,o.Pragma="no-cache",o["Cache-Control"]="no-cache",o.Upgrade="websocket",o.Connection="Upgrade";let S=a.connect(e,origin,r,o,s=>{l=m.OPEN,f=s,i.meta={headers:{"sec-websocket-protocol":s}},i.dispatchEvent(new Event("open"))},async s=>{typeof s=="string"?i.dispatchEvent(new MessageEvent("message",{data:s})):"byteLength"in s?(i.binaryType==="blob"?s=new Blob([s]):Object.setPrototypeOf(s,c),i.dispatchEvent(new MessageEvent("message",{data:s}))):"arrayBuffer"in s&&(i.binaryType==="arraybuffer"&&(s=await s.arrayBuffer(),Object.setPrototypeOf(s,c)),i.dispatchEvent(new MessageEvent("message",{data:s})))},(s,v)=>{l=m.CLOSED,i.dispatchEvent(new CloseEvent("close",{code:s,reason:v}))},()=>{l=m.CLOSED}),L=()=>l;Object.defineProperty(i,"readyState",{get:L,configurable:!0,enumerable:!0});let j=()=>{if(L()===m.CONNECTING)return new DOMException("Failed to execute 'send' on 'WebSocket': Still in CONNECTING state.")};return i.send=function(...s){let v=j();if(v)throw v;S(s[0])},Object.defineProperty(i,"url",{get:()=>e.toString(),configurable:!0,enumerable:!0}),Object.defineProperty(i,"protocol",{get:()=>f,configurable:!0,enumerable:!0}),i}async fetch(e,r){let n=new $(e,r),o=r?.headers||n.headers,c=o instanceof Headers?Object.fromEntries(o):o,h=r?.body||n.body,a=new URL(n.url);if(a.protocol.startsWith("blob:")){let f=await M(a),l=new k(f.body,f);return l.rawHeaders=Object.fromEntries(f.headers),l.rawResponse=f,l}let u=T();if(u.active||(await new Promise(f=>setTimeout(f,1e3)),u=T()),!u.active)throw"there are no bare clients";let i=u.active;i.ready||await i.init();for(let f=0;;f++){"host"in c?c.host=a.host:c.Host=a.host;let l=await i.request(a,n.method,h,c,n.signal),p=new k(B.includes(l.status)?void 0:l.body,{headers:new Headers(l.headers),status:l.status,statusText:l.statusText});p.rawHeaders=l.headers,p.rawResponse=new k(l.body),p.finalURL=a.toString();let y=r?.redirect||n.redirect;if(A.includes(p.status))switch(y){case"follow":{let S=p.headers.get("location");if(W>f&&S!==null){a=new URL(S,a);continue}else throw new TypeError("Failed to fetch")}case"error":throw new TypeError("Failed to fetch");case"manual":return p}else return p}}};self.ScramjetServiceWorker=class{constructor(e=self.__scramjet$config){this.client=new x,e.prefix||(e.prefix="/scramjet/"),this.config=e}route({request:e}){return!!e.url.startsWith(location.origin+this.config.prefix)}async fetch({request:e}){let r=new URLSearchParams(new URL(e.url).search);if(r.has("url"))return Response.redirect(self.__scramjet$bundle.rewriters.url.encodeUrl(r.get("url"),new URL(r.get("url"))));try{let n=new URL(self.__scramjet$bundle.rewriters.url.decodeUrl(e.url)),o=await this.client.fetch(n,{method:e.method,body:e.body,headers:e.headers,credentials:"omit",mode:e.mode==="cors"?e.mode:"same-origin",cache:e.cache,redirect:e.redirect}),c,h=self.__scramjet$bundle.rewriters.rewriteHeaders(o.rawHeaders,n);if(o.body)switch(e.destination){case"iframe":case"document":c=self.__scramjet$bundle.rewriters.rewriteHtml(await o.text(),n);break;case"script":c=self.__scramjet$bundle.rewriters.rewriteJs(await o.text(),n);break;case"style":c=self.__scramjet$bundle.rewriters.rewriteCss(await o.text(),n);break;case"sharedworker":break;case"worker":break;default:c=o.body;break}if(e.destination==="document"){let a=h["content-disposition"];if(!/\s*?((inline|attachment);\s*?)filename=/i.test(a)){let u=/^\s*?attachment/i.test(a)?"attachment":"inline",[i]=new URL(o.finalURL).pathname.split("/").slice(-1);h["content-disposition"]=`${u}; filename=${JSON.stringify(i)}`}}return h.accept==="text/event-stream"&&(h["content-type"]="text/event-stream"),crossOriginIsolated&&(h["Cross-Origin-Embedder-Policy"]="require-corp"),new Response(c,{headers:h,status:o.status,statusText:o.statusText})}catch(n){return["document","iframe"].includes(e.destination)?(console.error(n),J(n,self.__scramjet$bundle.rewriters.url.decodeUrl(e.url))):new Response(void 0,{status:500})}}};function V(t,e){let r=`
        errorTrace.value = ${JSON.stringify(t)};
        fetchedURL.textContent = ${JSON.stringify(e)};
        for (const node of document.querySelectorAll("#hostname")) node.textContent = ${JSON.stringify(location.hostname)};
        reload.addEventListener("click", () => location.reload());
        version.textContent = "0.0.1";
    `;return`<!DOCTYPE html>
        <html>
        <head>
        <meta charset="utf-8" />
        <title>Error</title>
        <style>
        * { background-color: white }
        </style>
        </head>
        <body>
        <h1 id="errorTitle">Error processing your request</h1>
        <hr />
        <p>Failed to load <b id="fetchedURL"></b></p>
        <p id="errorMessage">Internal Server Error</p>
        <textarea id="errorTrace" cols="40" rows="10" readonly></textarea>
        <p>Try:</p>
        <ul>
        <li>Checking your internet connection</li>
        <li>Verifying you entered the correct address</li>
        <li>Clearing the site data</li>
        <li>Contacting <b id="hostname"></b>"s administrator</li>
        <li>Verify the server isn"t censored</li>
        </ul>
        <p>If you"re the administrator of <b id="hostname"></b>, try:</p>
        <ul>
        <li>Restarting your server</li>
        <li>Updating Scramjet</li>
        <li>Troubleshooting the error on the <a href="https://github.com/MercuryWorkshop/scramjet" target="_blank">GitHub repository</a></li>
        </ul>
        <button id="reload">Reload</button>
        <hr />
        <p><i>Scramjet v<span id="version"></span></i></p>
        <script src="${"data:application/javascript,"+encodeURIComponent(r)}"><\/script>
        </body>
        </html>
        `}function J(t,e){let r={"content-type":"text/html"};return crossOriginIsolated&&(r["Cross-Origin-Embedd'er-Policy"]="require-corp"),new Response(V(String(t),e),{status:500,headers:r})}})();
