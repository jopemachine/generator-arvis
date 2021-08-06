import test from 'ava';
import arvishTest from 'arvish-test';

test(async t => {
	const arvish = arvishTest();
	const result = await arvish('node index.js Rainbow');

	t.deepEqual(result, [
		{
			title: 'Unicorn',
			subtitle: 'Rainbow'
		}
	]);
});
