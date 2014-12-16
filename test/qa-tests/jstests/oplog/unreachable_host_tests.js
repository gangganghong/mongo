if (typeof getToolTest === 'undefined') {
  load('jstests/configs/plain_28.config.js');
}

/*
 * Tests behavior when the host provided in --host or in --from is unreachable
 */

(function() {
  var CURRENT_MONGOD_RELEASE = '2.8';

  var toolTest = getToolTest('oplogUnreachableHostsTest');
  var commonToolArgs = getCommonToolArguments();

  var fromUnreachableError = 'error connecting to source host';
  var args = ['oplog'].concat(commonToolArgs).concat('--from',
    'doesnte.xist:27999');
  assert(toolTest.runTool.apply(toolTest, args) !== 0,
    'mongooplog should fail when --from is not reachable');
  var output = rawMongoProgramOutput();
    
  assert(output.indexOf(fromUnreachableError) !== -1,
    'mongooplog should output correct error when "from" is not reachable');

  // Clear output
  clearRawMongoProgramOutput();

  /** Overwrite so toolTest.runTool doesn't append --host */
  toolTest.runTool = function() {
    arguments[0] = 'mongo' + arguments[0];
    return runMongoProgram.apply(null , arguments);
  };

  var args = ['oplog'].concat(commonToolArgs).concat('--host', 'doesnte.xist',
    '--from', '127.0.0.1:' + toolTest.port);
  assert(toolTest.runTool.apply(toolTest, args) !== 0,
    'mongooplog should fail when --host is not reachable');

  var output = rawMongoProgramOutput();
  var hostUnreachableError = 'error connecting to destination host';

  assert(output.indexOf(hostUnreachableError) !== -1,
    'mongooplog should output correct error when "host" is not reachable');

  toolTest.stop();
})();
