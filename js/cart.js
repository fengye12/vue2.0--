/**
 * Created by jacksoft on 16/10/22.
 */

window.vm = new Vue({
	//this可以用VM代替；但是mounted中要用this.nextClick才能在里面使用vm
	el:'#app',
	data:{
		title: "",
		showModal:false,
		productList:[],
		totalMoney:0,
		checkAll:false,
		currentProduct:''
	},
	mounted: function () {
		this.$nextTick(function(){
		vm.cartView();//

		})
	},
	filters: {
		formatMoney: function (value) {
			// if(!quentity)quentity=1;
			return "¥ "+value.toFixed(2) +"元";
		}
	},
	methods:{
		cartView: function () {
			var _this=this;
			this.$http.get("data/cartData.json").then(function(response){
				// var res = response.data;
				_this.productList = response.body.result.list;
				// if(res && res.status=="1"){
				// 	this.productList = res.result.list;
				// 	// this.calcTotalMoney();
				// }
				_this.totalMoney=response.body.result.totalMoney;
			});
		},
		changeMoney:function(product,way){
			if(way>0){
				product.productQuentity++;
			}else{
				product.productQuentity--;
				if(product.productQuentity<1){
				product.productQuentity=1;
				}
			}
			this.calcTotalMoney();

		},
		selectedProduct:function(product){
			if(typeof product.checked=='undefined'){
				// Vue.set(product,'checked',true);//全局注册变量
				this.$set(product,'checked',true)
				//局变量部注册
			}else{
				product.checked=!product.checked;
			}
			this.calcTotalMoney();
			this.isCheckAll();

		},
		selectAll: function (isCheck) {
			this.checkAll=isCheck;
			this.productList.forEach(function (item) {
				if(typeof item.checked == "undefined"){
					Vue.set(item,"checked",isCheck);
				}else{
					item.checked = isCheck;
				}
			})
			this.calcTotalMoney();
		},
		isCheckAll: function () {
			let flag = true;
			this.productList.forEach(function (item) {
				if(!item.checked){
				flag = false;
				}
			})
			if(flag){
				this.checkAll = true;
			}else{
				this.checkAll = false;
			}

		},
		calcTotalMoney: function () {
			let totalMoney = 0;
			this.productList.forEach(function (item) {
				if(item.checked){
					totalMoney+=item.productPrice*item.productQuentity;
				}
			});
			this.totalMoney = totalMoney;
		},
		delConfirm: function (product) {
			this.showModal = true;
			this.currentProduct = product;
		},
		delCurrentProduct: function () {
			this.showModal = false;
			var index = this.productList.indexOf(this.currentProduct);
			this.productList.splice(index,1);
		}
	}
	});
	Vue.filter('money',function(value,type){
	return '￥'+value.toFixed(2)+type;
	})
