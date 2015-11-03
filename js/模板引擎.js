--创建一个简单的模板引擎
把一个字符串的变量用model的变量代替
基本思想是用一个正则表达式匹配{}
一个简单的模板引擎(替换{}中的内容)
function Template (tpl) {
	var fn,
		match,
		code = ['var r=[]'], //用于new Function创建一个函数
		re = /\{\s*([a-zA-Z\.\_0-9()]+)\s*\}/m, //匹配{}中的任何情况
		addLine = function(text) {
			code.push('r.push(\''+text.replace(/\'/g,'\\\").replace(/\n/g,'\\n').replace(/\r/g,'\');');
		};
		while (match = re.exec(tpl)) {
			if (match.index>0) {
				addLine(tpl.splice(0,match.index));
			}
			//解析完一段后 把解析的结果push到r 到后面的Function创建函数
			code.push('r.push(this.'+match[1]+');');
			tpl = tpl.substring(match.index+match[0].length); //从下一段的tpl重新解析
		}
		addLine(tpl);
		code.push('return r.join(\'\'):');
		// 创建函数 利用字符串创建了一个函数
		fn = new function(code.join('\n'));
		// render()调用函数并绑定this参数
		this.render = function(model) {
			return fn.apply(model);
		}
}

应用
<script id="tpl" type="text/plain">
    <p>Today: { date }</p>
    <a href="/{ user.id|safe }">{ user.company }</a>
</script>

利用jquery
var tpl = new Template($("#tpl").html());
var s = tpl.render({
	data:20120,
	user:{
		id:'A-000',
		company:'asdas'
	}
})
$('#other').html(s);