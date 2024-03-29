import { createApp, ref } from 'https://unpkg.com/vue@3/dist/vue.esm-browser.js'
import {env} from '/env.mjs'

new class{
	siteurl="https://z.c-rank.online"
	site="cr"
	main=ref({
		template:
`<script setup>
const model = defineModel()

function update() {
  model.value++
}
</script>
<template>
	<h1>signin {{model}}</h1>
</template>`
	})
	aside=ref(null)
	methods={

	}
	constructor(){
		createApp({
			methods:this.methods,
			setup:e=>this.setup()
		}).mount(".app")

		env.set("main",this)
		//this.init()
	}
	setup(){
		return{
			main:this.main,
			aside:this.aside
		}
	}
	async init(){
		var {code}=await this.xget("/signon")
		if(code==200){
			this.aside=await this.xget("/aside")
			this.main=await this.get("/page/home.htm")
		}else{
			this.aside=""
			this.main=await this.get("/page/signin.htm")
		}
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
