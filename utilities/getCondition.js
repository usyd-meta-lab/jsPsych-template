(function (global) {
  async function requestCondition() {
    const pipelineId = global.DataPipe_ID;

    if (!pipelineId) {
      throw new Error('DataPipe_ID is not defined on the global scope.');
    }

    const conditionValue = await jsPsychPipe.getCondition(pipelineId);
    global.condition = conditionValue;
    return conditionValue;
  }

  function getCondition() {
    if (!global.conditionPromise) {
      global.conditionPromise = requestCondition();
    }

    return global.conditionPromise;
  }

  global.getCondition = getCondition;
})(window);
