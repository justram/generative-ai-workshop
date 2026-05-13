import{__decorate as e,e$2 as t,i$1 as n,i$2 as r,n$1 as i,r as a,t$1 as o,x as s}from"./ThemeToggle-zh-tw7.js";let c=class extends n{constructor(...e){super(...e),this.minScale=.1,this.maxScale=100,this.points=[],this.showLabels=!1,this.hoveredPoint=void 0,this.hoveredX=0,this.hoveredY=0,this.isDragging=!1,this.scale=1,this.offsetX=0,this.offsetY=0,this.lastX=0,this.lastY=0,this.isPinching=!1,this.dragging=!1,this.ignoreClick=!1,this.touchStartDist=0,this.touchLastX=0,this.touchLastY=0,this.touchCenter={x:0,y:0},this.resizeListener=()=>this.resizeCanvas(),this.resizeObserver=null}calculateBounds(){if(this.points.length===0)return;let e=Math.min(...this.points.map(e=>e.x)),t=Math.max(...this.points.map(e=>e.x)),n=Math.min(...this.points.map(e=>e.y)),r=Math.max(...this.points.map(e=>e.y)),i=t-e,a=r-n,o=this.canvas,s=o.clientWidth,c=o.clientHeight,l=(s-100)/i,u=(c-100)/a;l<u?(this.scale=l,this.offsetX=50-e*this.scale,this.offsetY=(c-a*this.scale)/2-n*this.scale):(this.scale=u,this.offsetX=(s-i*this.scale)/2-e*this.scale,this.offsetY=50-n*this.scale)}firstUpdated(e){super.firstUpdated(e),this.ctx=this.canvas.getContext(`2d`),this.setupListeners(),this.resizeCanvas(),window.addEventListener(`resize`,this.resizeListener),this.resizeObserver=new ResizeObserver(()=>{this.resizeCanvas()}),this.resizeObserver.observe(this.canvas)}updated(e){if(super.updated(e),e.has(`points`)){let t=e.get(`points`);(!t||t.length!==this.points.length)&&this.calculateBounds(),this.draw()}}disconnectedCallback(){super.disconnectedCallback(),window.removeEventListener(`resize`,this.resizeListener),this.resizeObserver&&=(this.resizeObserver.disconnect(),null)}render(){return s`
			<canvas class=${this.isDragging?`grabbing`:``}></canvas>
			${this.hoveredPoint&&!this.isDragging?s`
						<div class="tooltip" style="left: ${this.hoveredX+10}px; top: ${this.hoveredY+10}px;">
							${(e=>{let t=e.split(`
`).map(e=>e.trim());return s`${t.map((e,t)=>s`${t>0?s`<br />`:``}${e}`)}`})(this.hoveredPoint.text)}
						</div>
					`:``}
		`}resizeCanvas(){let e=this.canvas;if(!e)return;let t=e.getBoundingClientRect(),n=window.devicePixelRatio||1,r=t.width*n,i=t.height*n;(e.width!==r||e.height!==i)&&(e.width=r,e.height=i,this.ctx=e.getContext(`2d`),this.ctx.scale(n,n),this.draw())}draw(){let e=this.ctx,t=this.canvas,n=t.clientWidth,r=t.clientHeight;e.fillStyle=getComputedStyle(this).getPropertyValue(`--background`)||`#fff`,e.fillRect(0,0,n,r),e.save(),e.translate(this.offsetX,this.offsetY),e.scale(this.scale,this.scale);let i=`hsl(250, 60%, 70%)`,a=`hsl(350, 80%, 55%)`,o=`hsl(200, 80%, 50%)`;this.points.forEach(t=>{t.isQuery||t===this.hoveredPoint||((t.isSelected||t.isKeywordMatch||t.isSemanticMatch)&&(e.globalAlpha=.3,e.fillStyle=t.color||i,e.beginPath(),e.arc(t.x,t.y,14/this.scale,0,Math.PI*2),e.fill()),e.beginPath(),e.arc(t.x,t.y,t.isSelected||t.isKeywordMatch||t.isSemanticMatch?7/this.scale:5/this.scale,0,Math.PI*2),e.fillStyle=t.color||i,e.globalAlpha=t.isSelected||t.isKeywordMatch||t.isSemanticMatch?1:.8,e.fill())}),this.hoveredPoint&&!this.hoveredPoint.isQuery&&(e.globalAlpha=.3,e.fillStyle=o,e.beginPath(),e.arc(this.hoveredPoint.x,this.hoveredPoint.y,12/this.scale,0,Math.PI*2),e.fill(),e.globalAlpha=1,e.fillStyle=o,e.beginPath(),e.arc(this.hoveredPoint.x,this.hoveredPoint.y,5/this.scale,0,Math.PI*2),e.fill());let s=this.points.find(e=>e.isQuery);s&&(s===this.hoveredPoint&&(e.globalAlpha=.2,e.fillStyle=a,e.beginPath(),e.arc(s.x,s.y,24/this.scale,0,Math.PI*2),e.fill()),e.globalAlpha=.3,e.fillStyle=a,e.beginPath(),e.arc(s.x,s.y,16/this.scale,0,Math.PI*2),e.fill(),e.globalAlpha=1,e.beginPath(),e.arc(s.x,s.y,8/this.scale,0,Math.PI*2),e.fill()),e.globalAlpha=1,e.restore()}getCanvasCoordinates(e){let t=this.canvas.getBoundingClientRect();return{x:(e.clientX-t.left-this.offsetX)/this.scale,y:(e.clientY-t.top-this.offsetY)/this.scale}}setupListeners(){let e=e=>{this.dragging=!0,this.isDragging=!1,this.lastX=e.clientX,this.lastY=e.clientY},t=e=>{if(this.dragging){let t=e.clientX-this.lastX,n=e.clientY-this.lastY;(Math.abs(t)>2||Math.abs(n)>2)&&(this.isDragging=!0),this.offsetX+=t,this.offsetY+=n,this.lastX=e.clientX,this.lastY=e.clientY,this.draw(),this.ignoreClick=!0,this.hoveredPoint=void 0}else{let{x:t,y:n}=this.getCanvasCoordinates(e),r,i=1/0;this.points.forEach(e=>{let a=Math.hypot(e.x-t,e.y-n);a<10/this.scale&&a<i&&(i=a,r=e)}),this.hoveredX=e.clientX,this.hoveredY=e.clientY,r!==this.hoveredPoint&&(this.hoveredPoint=r,this.draw())}},n=e=>{if(!this.isDragging&&this.onPointClick){let{x:t,y:n}=this.getCanvasCoordinates(e);this.points.forEach(e=>{Math.hypot(e.x-t,e.y-n)<10/this.scale&&(this.onPointClick?.(e),this.hoveredPoint=void 0)})}this.dragging=!1,this.isDragging=!1},r=e=>{e.preventDefault();let t=e.clientX,n=e.clientY,r=Math.exp(-e.deltaY*.001),i=Math.min(Math.max(this.minScale,this.scale*r),this.maxScale),a=this.canvas.getBoundingClientRect(),o=t-a.left,s=n-a.top,c=i/this.scale;this.offsetX=o-(o-this.offsetX)*c,this.offsetY=s-(s-this.offsetY)*c,this.scale=i,this.draw()},i=e=>{e.touches.length===2?(this.isPinching=!0,this.touchStartDist=Math.hypot(e.touches[0].clientX-e.touches[1].clientX,e.touches[0].clientY-e.touches[1].clientY),this.touchCenter.x=(e.touches[0].clientX+e.touches[1].clientX)/2,this.touchCenter.y=(e.touches[0].clientY+e.touches[1].clientY)/2):e.touches.length===1&&!this.isPinching&&(this.touchLastX=e.touches[0].clientX,this.touchLastY=e.touches[0].clientY)},a=e=>{if(e.preventDefault(),e.touches.length===2&&this.isPinching){let t=Math.hypot(e.touches[0].clientX-e.touches[1].clientX,e.touches[0].clientY-e.touches[1].clientY),n=t/this.touchStartDist,r=Math.min(Math.max(this.minScale,this.scale*n),this.maxScale),i={x:(e.touches[0].clientX+e.touches[1].clientX)/2,y:(e.touches[0].clientY+e.touches[1].clientY)/2},a=r/this.scale;this.offsetX=this.touchCenter.x-(this.touchCenter.x-this.offsetX)*a,this.offsetY=this.touchCenter.y-(this.touchCenter.y-this.offsetY)*a,this.offsetX+=i.x-this.touchCenter.x,this.offsetY+=i.y-this.touchCenter.y,this.scale=r,this.touchStartDist=t,this.touchCenter=i,this.draw()}else e.touches.length===1&&!this.isPinching&&(this.offsetX+=e.touches[0].clientX-this.touchLastX,this.offsetY+=e.touches[0].clientY-this.touchLastY,this.touchLastX=e.touches[0].clientX,this.touchLastY=e.touches[0].clientY,this.draw())},o=e=>{e.touches.length===1&&(this.touchLastX=e.touches[0].clientX,this.touchLastY=e.touches[0].clientY,this.isPinching=!1)},s=this.canvas;s.addEventListener(`mousedown`,e),s.addEventListener(`mousemove`,t),s.addEventListener(`mouseup`,n),s.addEventListener(`mouseleave`,()=>{this.dragging=!1,this.isDragging=!1}),s.addEventListener(`wheel`,r,{passive:!1}),s.addEventListener(`touchstart`,i),s.addEventListener(`touchmove`,a,{passive:!1}),s.addEventListener(`touchend`,o)}};c.styles=r`
		:host {
			display: block;
			width: 100%;
			height: 100%;
			position: relative;
		}

		canvas {
			width: 100%;
			height: 100%;
			cursor: grab;
		}

		canvas.grabbing {
			cursor: grabbing;
		}

		.tooltip {
			position: fixed;
			background: var(--popover);
			color: var(--popover-foreground);
			border: 1px solid var(--border);
			padding: 0.5rem;
			border-radius: var(--radius);
			font-size: 0.875rem;
			pointer-events: none;
			z-index: 10;
			max-width: 300px;
			box-shadow: var(--shadow-md);
			line-height: 1.4;
		}
	`,e([i({type:Number})],c.prototype,`minScale`,void 0),e([i({type:Number})],c.prototype,`maxScale`,void 0),e([i({type:Array})],c.prototype,`points`,void 0),e([i({type:Boolean})],c.prototype,`showLabels`,void 0),e([i({type:Function})],c.prototype,`onPointClick`,void 0),e([a()],c.prototype,`hoveredPoint`,void 0),e([a()],c.prototype,`hoveredX`,void 0),e([a()],c.prototype,`hoveredY`,void 0),e([a()],c.prototype,`isDragging`,void 0),e([t(`canvas`)],c.prototype,`canvas`,void 0),c=e([o(`scatter-plot`)],c);