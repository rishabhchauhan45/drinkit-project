const fs = require('fs');

const transcriptPath = 'C:\\Users\\risha\\.gemini\\antigravity-ide\\brain\\1336a8ed-9c99-49c3-baa1-1d0fe488af1f\\.system_generated\\logs\\transcript.jsonl';
const lines = fs.readFileSync(transcriptPath, 'utf8').split('\n').filter(Boolean);

let filesModified = new Set();
let filesCreated = new Set();
let commandsRun = [];
let userRequests = [];
let modelResponses = [];

for (const line of lines) {
  try {
    const step = JSON.parse(line);
    
    if (step.type === 'USER_INPUT') {
      userRequests.push(step.content);
    }
    
    if (step.type === 'PLANNER_RESPONSE') {
       if (step.content) {
           modelResponses.push(step.content);
       }
       if (step.tool_calls) {
          for (const call of step.tool_calls) {
             if (call.name === 'replace_file_content' || call.name === 'multi_replace_file_content') {
                 filesModified.add(call.args.TargetFile);
             }
             if (call.name === 'write_to_file') {
                 filesCreated.add(call.args.TargetFile);
             }
             if (call.name === 'run_command') {
                 commandsRun.push(call.args.CommandLine);
             }
          }
       }
    }
  } catch (e) {
     // ignore
  }
}

console.log('Files Modified:', Array.from(filesModified));
console.log('Files Created:', Array.from(filesCreated));
console.log('Commands Run (last 10):', commandsRun.slice(-10));
console.log('User Requests (last 5):', userRequests.slice(-5).map(r => r.substring(0, 100)));
console.log('Model Responses (last 5):', modelResponses.slice(-5).map(r => r.substring(0, 100)));
