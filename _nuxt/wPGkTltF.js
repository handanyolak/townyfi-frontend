import{p as O,a as x,c as T,d as M,S as C,Q as W,J as k,f as R,g as v,O as _,A as d,x as E,h as N,j as u,C as l,W as g,k as I,l as U,M as $,R as D,m as b,N as w,n as P}from"./BCFdri8Y.js";import{o as ne,V as ie,Y as ae}from"./BCFdri8Y.js";import"./DhnQA8TG.js";import"./BxCO1X6t.js";const c=O({status:"uninitialized"}),f={state:c,subscribeKey(e,t){return x(c,e,t)},subscribe(e){return T(c,()=>e(c))},_getClient(){if(!c._client)throw new Error("SIWEController client not set");return c._client},async getNonce(e){const a=await this._getClient().getNonce(e);return this.setNonce(a),a},async getSession(){try{const t=await this._getClient().getSession();return t&&(this.setSession(t),this.setStatus("success")),t||void 0}catch{return}},createMessage(e){const a=this._getClient().createMessage(e);return this.setMessage(a),a},async verifyMessage(e){return await this._getClient().verifyMessage(e)},async signIn(){return await this._getClient().signIn()},async signOut(){const e=this._getClient();await e.signOut(),this.setStatus("ready"),this.setSession(void 0),e.onSignOut?.()},onSignIn(e){this._getClient().onSignIn?.(e)},onSignOut(){this._getClient().onSignOut?.()},async setSIWEClient(e){c._client=M(e),c.session=await this.getSession(),c.status=c.session?"success":"ready"},setNonce(e){c.nonce=e},setStatus(e){c.status=e},setMessage(e){c.message=e},setSession(e){c.session=e,c.status=e?"success":"ready"}},y={FIVE_MINUTES_IN_MS:3e5};class j{constructor(t){const{enabled:a=!0,nonceRefetchIntervalMs:s=y.FIVE_MINUTES_IN_MS,sessionRefetchIntervalMs:n=y.FIVE_MINUTES_IN_MS,signOutOnAccountChange:i=!0,signOutOnDisconnect:r=!0,signOutOnNetworkChange:o=!0,...p}=t;this.options={enabled:a,nonceRefetchIntervalMs:s,sessionRefetchIntervalMs:n,signOutOnDisconnect:r,signOutOnAccountChange:i,signOutOnNetworkChange:o},this.methods=p}async getNonce(t){const a=await this.methods.getNonce(t);if(!a)throw new Error("siweControllerClient:getNonce - nonce is undefined");return a}async getMessageParams(){return await this.methods.getMessageParams?.()||{}}createMessage(t){const a=this.methods.createMessage(t);if(!a)throw new Error("siweControllerClient:createMessage - message is undefined");return a}async verifyMessage(t){return await this.methods.verifyMessage(t)}async getSession(){const t=await this.methods.getSession();if(!t)throw new Error("siweControllerClient:getSession - session is undefined");return t}async signIn(){await C.requestSignMessage();const t=await this.methods.getSession();if(!t)throw new Error("Error verifying SIWE signature");return t}async signOut(){const t=C.getSIWX();return t?(await t.setSessions([]),!0):!1}}const K=/0x[a-fA-F0-9]{40}/u,V=/Chain ID: (?<temp1>\d+)/u;function q(e){return e.match(K)?.[0]||""}function G(e){return`eip155:${e.match(V)?.[1]||1}`}async function J({address:e,message:t,signature:a,chainId:s,projectId:n}){let i=W(e,t,a);return i||(i=await k(e,t,a,s,n)),i}const F=R`
  :host {
    display: flex;
    justify-content: center;
    gap: var(--wui-spacing-2xl);
  }

  wui-visual-thumbnail:nth-child(1) {
    z-index: 1;
  }
`;var X=function(e,t,a,s){var n=arguments.length,i=n<3?t:s===null?s=Object.getOwnPropertyDescriptor(t,a):s,r;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")i=Reflect.decorate(e,t,a,s);else for(var o=e.length-1;o>=0;o--)(r=e[o])&&(i=(n<3?r(i):n>3?r(t,a,i):r(t,a))||i);return n>3&&i&&Object.defineProperty(t,a,i),i};let S=class extends v{constructor(){super(...arguments),this.dappImageUrl=_.state.metadata?.icons,this.walletImageUrl=d.state.connectedWalletInfo?.icon}firstUpdated(){const t=this.shadowRoot?.querySelectorAll("wui-visual-thumbnail");t?.[0]&&this.createAnimation(t[0],"translate(18px)"),t?.[1]&&this.createAnimation(t[1],"translate(-18px)")}render(){return E`
      <wui-visual-thumbnail
        ?borderRadiusFull=${!0}
        .imageSrc=${this.dappImageUrl?.[0]}
      ></wui-visual-thumbnail>
      <wui-visual-thumbnail .imageSrc=${this.walletImageUrl}></wui-visual-thumbnail>
    `}createAnimation(t,a){t.animate([{transform:"translateX(0px)"},{transform:a}],{duration:1600,easing:"cubic-bezier(0.56, 0, 0.48, 1)",direction:"alternate",iterations:1/0})}};S.styles=F;S=X([N("w3m-connecting-siwe")],S);var m=function(e,t,a,s){var n=arguments.length,i=n<3?t:s===null?s=Object.getOwnPropertyDescriptor(t,a):s,r;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")i=Reflect.decorate(e,t,a,s);else for(var o=e.length-1;o>=0;o--)(r=e[o])&&(i=(n<3?r(i):n>3?r(t,a,i):r(t,a))||i);return n>3&&i&&Object.defineProperty(t,a,i),i};let h=class extends v{constructor(){super(...arguments),this.dappName=_.state.metadata?.name,this.isSigning=!1,this.isCancelling=!1}render(){return E`
      <wui-flex justifyContent="center" .padding=${["2xl","0","xxl","0"]}>
        <w3m-connecting-siwe></w3m-connecting-siwe>
      </wui-flex>
      <wui-flex
        .padding=${["0","4xl","l","4xl"]}
        gap="s"
        justifyContent="space-between"
      >
        <wui-text variant="paragraph-500" align="center" color="fg-100"
          >${this.dappName??"Dapp"} needs to connect to your wallet</wui-text
        >
      </wui-flex>
      <wui-flex
        .padding=${["0","3xl","l","3xl"]}
        gap="s"
        justifyContent="space-between"
      >
        <wui-text variant="small-400" align="center" color="fg-200"
          >Sign this message to prove you own this wallet and proceed. Canceling will disconnect
          you.</wui-text
        >
      </wui-flex>
      <wui-flex .padding=${["l","xl","xl","xl"]} gap="s" justifyContent="space-between">
        <wui-button
          size="lg"
          borderRadius="xs"
          fullWidth
          variant="neutral"
          ?loading=${this.isCancelling}
          @click=${this.onCancel.bind(this)}
          data-testid="w3m-connecting-siwe-cancel"
        >
          Cancel
        </wui-button>
        <wui-button
          size="lg"
          borderRadius="xs"
          fullWidth
          variant="main"
          @click=${this.onSign.bind(this)}
          ?loading=${this.isSigning}
          data-testid="w3m-connecting-siwe-sign"
        >
          ${this.isSigning?"Signing...":"Sign"}
        </wui-button>
      </wui-flex>
    `}async onSign(){this.isSigning=!0,u.sendEvent({event:"CLICK_SIGN_SIWX_MESSAGE",type:"track",properties:{network:l.state.activeCaipNetwork?.caipNetworkId||"",isSmartAccount:d.state.preferredAccountType===g.ACCOUNT_TYPES.SMART_ACCOUNT}});try{f.setStatus("loading");const t=await f.signIn();return f.setStatus("success"),u.sendEvent({event:"SIWX_AUTH_SUCCESS",type:"track",properties:{network:l.state.activeCaipNetwork?.caipNetworkId||"",isSmartAccount:d.state.preferredAccountType===g.ACCOUNT_TYPES.SMART_ACCOUNT}}),t}catch{const s=d.state.preferredAccountType===g.ACCOUNT_TYPES.SMART_ACCOUNT;return s?I.showError("This application might not support Smart Accounts"):I.showError("Signature declined"),f.setStatus("error"),u.sendEvent({event:"SIWX_AUTH_ERROR",type:"track",properties:{network:l.state.activeCaipNetwork?.caipNetworkId||"",isSmartAccount:s}})}finally{this.isSigning=!1}}async onCancel(){this.isCancelling=!0,l.state.activeCaipAddress?(await U.disconnect(),$.close()):D.push("Connect"),this.isCancelling=!1,u.sendEvent({event:"CLICK_CANCEL_SIWX",type:"track",properties:{network:l.state.activeCaipNetwork?.caipNetworkId||"",isSmartAccount:d.state.preferredAccountType===g.ACCOUNT_TYPES.SMART_ACCOUNT}})}};m([b()],h.prototype,"isSigning",void 0);m([b()],h.prototype,"isCancelling",void 0);h=m([N("w3m-connecting-siwe-view")],h);const A=[];function Z(e){async function t(){try{const s=await e.methods.getSession();if(!s)return;if(!s?.address)throw new Error("SIWE session is missing address");if(!s?.chainId)throw new Error("SIWE session is missing chainId");return s}catch(s){console.warn("AppKit:SIWE:getSession - error:",s);return}}async function a(){await e.methods.signOut(),e.methods.onSignOut?.()}return A.forEach(s=>s()),A.push(l.subscribeKey("activeCaipNetwork",async s=>{if(!e.options.signOutOnNetworkChange)return;const n=await t();n&&n.chainId!==w.caipNetworkIdToNumber(s?.caipNetworkId)&&await a()}),l.subscribeKey("activeCaipAddress",async s=>{if(e.options.signOutOnDisconnect&&!s){await t()&&await a();return}if(e.options.signOutOnAccountChange){const n=await t(),i=n?.address?.toLowerCase(),r=P?.getPlainAddress(s)?.toLowerCase();n&&i!==r&&await a()}})),{async createMessage(s){const n=await e.methods.getMessageParams?.();if(!n)throw new Error("Failed to get message params!");const i=await e.getNonce(s.accountAddress),r=n.iat||new Date().toISOString(),o="1";return{nonce:i,version:o,requestId:n.requestId,accountAddress:s.accountAddress,chainId:s.chainId,domain:n.domain,uri:n.uri,notBefore:n.nbf,resources:n.resources,statement:n.statement,expirationTime:n.exp,issuedAt:r,toString:()=>e.createMessage({...n,chainId:w.caipNetworkIdToNumber(s.chainId)||1,address:`did:pkh:${s.chainId}:${s.accountAddress}`,nonce:i,version:o,iat:r})}},async addSession(s){if(!w.parseEvmChainId(s.data.chainId))return Promise.resolve();if(await e.methods.verifyMessage(s))return e.methods.onSignIn?.({address:s.data.accountAddress,chainId:w.parseEvmChainId(s.data.chainId)}),Promise.resolve();throw new Error("Failed to verify message")},async revokeSession(s,n){try{await a()}catch(i){console.warn("AppKit:SIWE:revokeSession - signOut error",i)}},async setSessions(s){if(s.length===0)try{await a()}catch(n){console.warn("AppKit:SIWE:setSessions - signOut error",n)}else{const n=s.find(i=>i.data.chainId===l.getActiveCaipNetwork()?.caipNetworkId)||s[0];await this.addSession(n)}},async getSessions(s,n){try{if(!s.startsWith("eip155:"))return[{data:{accountAddress:n,chainId:s},message:"",signature:""}];const i=await t(),r=`eip155:${i?.chainId}`,o=i?.address?.toLowerCase(),p=n?.toLowerCase();return!i||o!==p||r!==s?[]:[{data:{accountAddress:i.address,chainId:r},message:"",signature:""}]}catch(i){return console.warn("AppKit:SIWE:getSessions - error:",i),[]}}}}function ee(e){return new j(e)}export{f as SIWEController,S as W3mConnectingSiwe,h as W3mConnectingSiweView,ee as createSIWEConfig,ne as formatMessage,q as getAddressFromMessage,G as getChainIdFromMessage,ie as getDidAddress,ae as getDidChainId,Z as mapToSIWX,J as verifySignature};
