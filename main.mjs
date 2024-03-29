import { createApp, ref } from 'https://unpkg.com/vue@3/dist/vue.esm-browser.js'
import {local,signal} from '/env.mjs'

new class{
	siteurl="https://z.c-rank.online"
	site="cr"
	#main
	#aside
	methods={

	}
	constructor(){
		var dom=document.body.querySelectorAll("*")

		local.app=this
		createApp({
			methods:this.methods,
			setup:e=>this.setup()
		}).mount(".app")

		this.#main=dom[0]
		this.#aside=dom[1]
		this.init()
	}
	setup(){
		return{
		}
	}
	async init(){
		var {code}=await this.xget("/signon")
		if(code==200){
			this.aside=await this.xget("/aside")
			this.main=await this.get("home","/page/home.htm")
		}else{
			this.aside=""
			this.main=await this.load("signin","/page/signin.htm")
		}
	}
	load(name,url){
		var task=new Promise((resolve,reject)=>{
			var x=new XMLHttpRequest()
			x.responseType="document"
			x.open("GET",url,true)
			x.onload=e=>resolve(x.response)
			x.onerror=reject
			x.send()
		})
		return new Promise(async(resolve,reject)=>{
			var body=await task
			signal.set(name,e=>{
				var el=body.querySelector("div")
				var app=createApp(e)
				app.mount(el)
				this.#main.appendChild(el)
				signal.delete(name)
				resolve(app)
			})
			this.#main.appendChild(body.querySelector("style"))
			this.#main.appendChild(body.querySelector("script"))
		})
	}
	async get(url){
		var res=await fetch(url)
		var text=await res.text()
		try{
			return JSON.parse(text)
		}catch(e){}
		return text
	}
	async xget(url){
		var res=await fetch(this.siteurl+url,{
			credentials: "include"
		})
		var text=await res.text()
		try{
			return JSON.parse(text)
		}catch(e){}
		return text
	}
	async xpost(url,obj){
		var res=await fetch(this.siteurl+url,{
			credentials: "include",
			method:"POST",
			body:JSON.stringify({
				site:this.site,
				...obj
			})
		})
		var text=await res.text()
		try{
			return JSON.parse(text)
		}catch(e){}
		return text
	}
	runScript(node,script){
		var src=document.createElement("script")
		src.type="module"
		src.text=script.text
		node.appendChild(src)
		script.remove()
	}
}
