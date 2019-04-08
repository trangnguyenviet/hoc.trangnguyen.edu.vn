/**
 * Created by tanmv on 20/04/2017.
 */
module.exports = (redis) => {
	//bootstrap models
	require('./AutoLoadModels')();

	//bootstrap services
	require('./AutoLoadServices')(redis);
};