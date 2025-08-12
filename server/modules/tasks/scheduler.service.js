const Task = require('./task.model');
const User = require('../users/user.model');


async function assignBestAssignee(taskId) {
  const task = await Task.findById(taskId);

  const candidates = await User.find({ });

 
  const scored = candidates.map(u => {
    let score = 0;
    
    if (task.meta?.requiredSkills) {
      const matched = (u.skills || []).filter(s => task.meta.requiredSkills.includes(s)).length;
      score += matched * 10;
    }
 
    score += (u.availability || 0) * 5;
  
    score -= (u.currentWorkload || 0) * 2;
   
    if (u.role === 'member') score += 1;
    return { user: u, score };
  });

  scored.sort((a,b) => b.score - a.score);
  const best = scored[0];
  if (best) {
    task.assignees = [best.user._id];
    await task.save();
    return best.user;
  }
  return null;
}

module.exports = { assignBestAssignee };
