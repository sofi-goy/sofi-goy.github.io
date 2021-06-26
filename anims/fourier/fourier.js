function dft(x, y){
	const N = x.length;
	let X = [];
	for(let i=0; i<N;i++){
		let re = 0;
		let im = 0;
		for(let j=0; j<N; j++){
			let phi = (TWO_PI  * i * j) / N;
			re += x[j] * cos(phi) + y[j] * sin(phi);
			im += y[j] * cos(phi) - x[j] * sin(phi);
		}
		re = re / N;
		im = im / N;

		freq = i;
		ampl = sqrt(re*re + im*im);
		phase = atan2(im, re);
		
		X[i] = {re, im, freq, ampl, phase};
	}

	return X;
}