function smoothScroll(target, speed, smooth) {
	if (target == document)
		target = (document.documentElement || document.body.parentNode || document.body) // cross browser support for document scrolling
	var moving = false;
	var pos = getCurrentScroll();
	target.addEventListener('mousewheel', scrolled, false);
	target.addEventListener('DOMMouseScroll', scrolled, false);

	function scrolled(e) {
		e.preventDefault(); // disable default scrolling
		var delta = e.delta || e.wheelDelta;
		if (delta === undefined) {
			//we are on firefox
			delta = -e.detail;
		}
		delta = Math.max(-1, Math.min(1, delta)) // cap the delta to [-1,1] for cross browser consistency

		var scrollVal = getScrollVal();
		var clientVal = getClientVal();
		pos += -delta * speed
		pos = Math.max(0, Math.min(pos, scrollVal - clientVal)) // limit scrolling

		if (!moving) update()
	}

	function getScrollVal(){
		return target.scrollWidth;
	}
	function getClientVal(){
		return target.clientWidth;
	}
	function getCurrentScroll(){
		return target.scrollLeft;
	}
	function setCurrentScroll(val){
		target.scrollLeft = val;
	}

	function update() {
		var currentScroll = getCurrentScroll();
		document._test_element = target;

		moving = true;
		var delta = (pos - currentScroll) / smooth;

		setCurrentScroll(currentScroll + delta);
		
		if (Math.abs(delta) > 0.5)
			requestFrame(update)
		else
			moving = false
	}

	var requestFrame = function() { // requestAnimationFrame cross browser
		return (
			window.requestAnimationFrame ||
			window.webkitRequestAnimationFrame ||
			window.mozRequestAnimationFrame ||
			window.oRequestAnimationFrame ||
			window.msRequestAnimationFrame ||
			function(func) {
				window.setTimeout(func, 1000 / 50);
			}
		);
	}()
}

module.exports = smoothScroll;