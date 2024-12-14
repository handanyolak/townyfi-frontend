import{f,g as b,M as i,C as c,a$ as k,j as v,x as y,R as w,S as p,U as g,u as C,k as x,n as N,m as h,h as L,b0 as A}from"./CN7ALser.js";import"./D5p5h0ju.js";import"./QjbehqUc.js";const S=f`
  :host {
    z-index: var(--w3m-z-index);
    display: block;
    backface-visibility: hidden;
    will-change: opacity;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    pointer-events: none;
    opacity: 0;
    background-color: var(--wui-cover);
    transition: opacity 0.2s var(--wui-ease-out-power-2);
    will-change: opacity;
  }

  :host(.open) {
    opacity: 1;
  }

  wui-card {
    max-width: var(--w3m-modal-width);
    width: 100%;
    position: relative;
    animation: zoom-in 0.2s var(--wui-ease-out-power-2);
    animation-fill-mode: backwards;
    outline: none;
  }

  wui-card[shake='true'] {
    animation:
      zoom-in 0.2s var(--wui-ease-out-power-2),
      w3m-shake 0.5s var(--wui-ease-out-power-2);
  }

  wui-flex {
    overflow-x: hidden;
    overflow-y: auto;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
  }

  @media (max-height: 700px) and (min-width: 431px) {
    wui-flex {
      align-items: flex-start;
    }

    wui-card {
      margin: var(--wui-spacing-xxl) 0px;
    }
  }

  @media (max-width: 430px) {
    wui-flex {
      align-items: flex-end;
    }

    wui-card {
      max-width: 100%;
      border-bottom-left-radius: 0;
      border-bottom-right-radius: 0;
      border-bottom: none;
      animation: slide-in 0.2s var(--wui-ease-out-power-2);
    }

    wui-card[shake='true'] {
      animation:
        slide-in 0.2s var(--wui-ease-out-power-2),
        w3m-shake 0.5s var(--wui-ease-out-power-2);
    }
  }

  @keyframes zoom-in {
    0% {
      transform: scale(0.95) translateY(0);
    }
    100% {
      transform: scale(1) translateY(0);
    }
  }

  @keyframes slide-in {
    0% {
      transform: scale(1) translateY(50px);
    }
    100% {
      transform: scale(1) translateY(0);
    }
  }

  @keyframes w3m-shake {
    0% {
      transform: scale(1) rotate(0deg);
    }
    20% {
      transform: scale(1) rotate(-1deg);
    }
    40% {
      transform: scale(1) rotate(1.5deg);
    }
    60% {
      transform: scale(1) rotate(-1.5deg);
    }
    80% {
      transform: scale(1) rotate(1deg);
    }
    100% {
      transform: scale(1) rotate(0deg);
    }
  }

  @keyframes w3m-view-height {
    from {
      height: var(--prev-height);
    }
    to {
      height: var(--new-height);
    }
  }
`;var s=function(n,e,t,o){var l=arguments.length,a=l<3?e:o===null?o=Object.getOwnPropertyDescriptor(e,t):o,d;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")a=Reflect.decorate(n,e,t,o);else for(var m=n.length-1;m>=0;m--)(d=n[m])&&(a=(l<3?d(a):l>3?d(e,t,a):d(e,t))||a);return l>3&&a&&Object.defineProperty(e,t,a),a};const u="scroll-lock";let r=class extends b{constructor(){super(),this.unsubscribe=[],this.abortController=void 0,this.open=i.state.open,this.caipAddress=c.state.activeCaipAddress,this.caipNetwork=c.state.activeCaipNetwork,this.shake=i.state.shake,this.initializeTheming(),k.prefetch(),this.unsubscribe.push(i.subscribeKey("open",e=>e?this.onOpen():this.onClose()),i.subscribeKey("shake",e=>this.shake=e),c.subscribeKey("activeCaipNetwork",e=>this.onNewNetwork(e)),c.subscribeKey("activeCaipAddress",e=>this.onNewAddress(e))),v.sendEvent({type:"track",event:"MODAL_LOADED"})}disconnectedCallback(){this.unsubscribe.forEach(e=>e()),this.onRemoveKeyboardListener()}render(){return this.open?y`
          <wui-flex @click=${this.onOverlayClick.bind(this)} data-testid="w3m-modal-overlay">
            <wui-card
              shake="${this.shake}"
              role="alertdialog"
              aria-modal="true"
              tabindex="0"
              data-testid="w3m-modal-card"
            >
              <w3m-header></w3m-header>
              <w3m-router></w3m-router>
              <w3m-snackbar></w3m-snackbar>
              <w3m-alertbar></w3m-alertbar>
            </wui-card>
          </wui-flex>
          <w3m-tooltip></w3m-tooltip>
        `:null}async onOverlayClick(e){e.target===e.currentTarget&&await this.handleClose()}async handleClose(){w.state.view==="UnsupportedChain"||await p.isSIWXCloseDisabled()?i.shake():i.close()}initializeTheming(){const{themeVariables:e,themeMode:t}=A.state,o=g.getColorTheme(t);C(e,o)}onClose(){this.open=!1,this.classList.remove("open"),this.onScrollUnlock(),x.hide(),this.onRemoveKeyboardListener()}onOpen(){this.open=!0,this.classList.add("open"),this.onScrollLock(),this.onAddKeyboardListener()}onScrollLock(){const e=document.createElement("style");e.dataset.w3m=u,e.textContent=`
      body {
        touch-action: none;
        overflow: hidden;
        overscroll-behavior: contain;
      }
      w3m-modal {
        pointer-events: auto;
      }
    `,document.head.appendChild(e)}onScrollUnlock(){const e=document.head.querySelector(`style[data-w3m="${u}"]`);e&&e.remove()}onAddKeyboardListener(){this.abortController=new AbortController;const e=this.shadowRoot?.querySelector("wui-card");e?.focus(),window.addEventListener("keydown",t=>{if(t.key==="Escape")this.handleClose();else if(t.key==="Tab"){const{tagName:o}=t.target;o&&!o.includes("W3M-")&&!o.includes("WUI-")&&e?.focus()}},this.abortController)}onRemoveKeyboardListener(){this.abortController?.abort(),this.abortController=void 0}async onNewAddress(e){const t=N.getPlainAddress(e);this.caipAddress=e,await p.initializeIfEnabled(),t||i.close()}onNewNetwork(e){if(!this.caipAddress){this.caipNetwork=e,w.goBack();return}const t=this.caipNetwork?.caipNetworkId?.toString(),o=e?.caipNetworkId?.toString();t&&o&&t!==o&&this.caipNetwork?.name!=="Unknown Network"&&w.goBack(),this.caipNetwork=e}};r.styles=S;s([h()],r.prototype,"open",void 0);s([h()],r.prototype,"caipAddress",void 0);s([h()],r.prototype,"caipNetwork",void 0);s([h()],r.prototype,"shake",void 0);r=s([L("w3m-modal")],r);export{r as W3mModal};
