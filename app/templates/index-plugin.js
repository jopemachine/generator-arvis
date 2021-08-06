const arvish = require('arvish');

module.exports = async ({ inputStr }) => {
	return {
		items: [
			{
				title: 'Unicorn',
				subtitle: inputStr
			}
		],
	};
};