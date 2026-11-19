/* Reach challenge registry. Each challenge is data: a scene, who you meet, the goal, the rules text.
   A challenge with no `scene` shows as "coming soon". The engine (game.js) reads this file.
   Add a challenge = add an entry here + (if new) a scene file in /game/scenes/<name>.js. */
(function(){
function C(t,place,diff,goal,o){var x={t:t,place:place,diff:diff,goal:goal};if(o)for(var k in o)x[k]=o[k];return x}

var CATS={
 toasting:{name:'Rizz',cls:'t',eyebrow:'Romance',blurb:'Approach someone you like and see where the conversation goes.'},
 friends:{name:'Friendship',cls:'f',eyebrow:'Friendship',blurb:'Meet strangers, join groups, and turn a hello into a friend. For all ages.'},
 startup:{name:'Startup',cls:'s',eyebrow:'Business',blurb:'Pitch, persuade and win people over when something real is at stake.'},
 speaking:{name:'Public Speaking',cls:'p',eyebrow:'Speaking',blurb:'Stand up, speak, and hold a room.'},
 career:{name:'Career Skills',cls:'c',eyebrow:'Work',blurb:'Interviews, complaints, negotiations and the conversations that decide a career.'}
};

var BAR_AI={
 intro:'A human player is trying to start a conversation with you at a bar.',
 scene:function(p,approach){return 'SCENE: The Copper Lantern, a cosy neighbourhood bar, about 9pm on a Friday. You are '+p.circ+'. '+approach+' Your mood: '+p.mood+'.'},
 style:'Talk like a real person in a bar',
 win:'"end" must be null while the conversation continues. Set it to "won" only when your interest is at least 70 and comfort at least 60, the player has naturally proposed a next step (your number, or a plan to meet again), and you would honestly say yes. Say yes in your own way and describe the exchange in "cue" (swap numbers, put the number in their phone). Never write any digits or a real phone number. Do not agree to a next step in the first 3 exchanges unless it is truly earned. Set "declined" when you kindly turn down a proposed next step or make clear you are not interested and the chat winds down calmly. Set "left" when you walk away because of discomfort, boredom or pushiness.',
 wrap:function(T){return 'Each player message is marked with its turn number out of '+T+'. From about turn 11 your friends are arriving or you need to go, so wrap up naturally. At turn '+T+' you must end it.'},
 review:'a conversation at a bar',
 how:{won:'she or he agreed to a next step',declined:'the character declined or the chat wound down calmly',left:'the character disengaged and left',timeout:'the conversation ran out of time',player_left:'the player walked away'}
};

var DATE_AI={
 intro:'The player is on a first date with you.',
 scene:function(p){return 'SCENE: Rosa\'s, a small candlelit restaurant, about 8pm on a Saturday. You and the player are sitting at a table for two. You are '+p.circ+'. You agreed to this date, so you are open to a good evening but you decide honestly how it goes. Your mood: '+p.mood+'.'},
 style:'Talk like a real person on a first date',
 win:'This is a first date. There is no number to give and no deal to close: you judge the whole evening. "end" must be null until the final turn. Never set "won" before the last two turns. At the final turn the evening ends (the bill, the walk out) and you decide honestly how it went: set "won" only if you really enjoyed yourself, your interest is at least 70 and comfort at least 65; otherwise set "declined" (polite, pleasant, not interested in a second date). Set "left" only if the player is rude, crude or makes you uncomfortable and you leave the table. Never write digits or a real phone number.',
 wrap:function(T){return 'Each player message is marked with its turn number out of '+T+'. The meal moves on: starters arrive early, mains around turn 6, dessert around turn 11, the bill near turn '+(T-1)+'. At turn '+T+' you must end the evening.'},
 review:'a first date at a restaurant',
 how:{won:'she or he had a good evening and would see the player again',declined:'the evening was pleasant but she or he did not want a second date',left:'the character left the table because of discomfort or pushiness',timeout:'the evening ran out',player_left:'the player left the table'}
};

var D={
 toasting:[
  C('Break the Ice at the Bar','Neighbourhood bar',1,'Start a conversation and leave with a way to see them again, if the interest is real.',{scene:'bar',mode:'approach',picker:{me:true,target:true},custom:true,maxT:14,ai:BAR_AI,
    situation:'It is Friday evening at The Copper Lantern, a cosy neighbourhood bar. Five people are out on their own. You walk in, look around, and decide what to do.',
    chat:{name:'The Copper Lantern',sub:'Evening. Soft music. Plenty of people.',who:'At the bar'},
    pre:'Look around. You just walked in. Five {people} are out tonight, each on their own. Choose who you want to talk to, walk over when you are ready, then tap Talk.',
    circs:['waiting for a friend who is running late','having a quiet drink after a long week','celebrating a small win alone before friends turn up','killing time before a train','half-watching the match on the TV','reading on a phone with a drink'],
    cast:{n:5},go:'Walk in',placeholder:'Say something to {her}',leave:'Walk away'}),
  C('The Date','Restaurant',2,'Have a good conversation throughout the evening and make it an experience she or he enjoys. She or he decides at the end.',{scene:'restaurant',mode:'seated',picker:{me:true,target:true},custom:true,maxT:16,ai:DATE_AI,winScore:70,minWinTurn:15,
    situation:'It is Saturday evening at Rosa\'s, a small candlelit restaurant. You are sitting at a table for two on a first date. There is no number to ask for and nothing to close: the goal is a good evening. At the end, she or he decides honestly how it went.',
    chat:{name:'Rosa\'s',sub:'Candlelit table for two.',who:'Your date'},
    pre:'You have just sat down. {Name} is across the table. Say hello and see where the evening goes. There is no hurry: the meal will carry the night.',
    circs:['arrived a few minutes early and ordered water','is glad to be out after a long week','is a little nervous but hiding it well','came straight from work and is still unwinding'],
    hint:'Ask about their life and answer what they ask. A date is a back and forth, not an interview.',openCue:function(p){return p.name+' looks up with a small smile as you sit down.'},timeoutCue:function(p){return 'The bill arrives and the evening comes to an end.'},cast:{n:1},go:'Take your seat',placeholder:'Say something to {her}',leave:'Leave the table'}),
  C('The Last Bus','Bus stop',2,'Have an enjoyable chat and agree a date and a time before her bus arrives.'),
  C('Table for More','Restaurant',3,'Approach a group of three women and get them to welcome you to their table.'),
  C('Coffee by Text','Group chat',2,'Pick someone from the group chat, build rapport by message and get her to agree to coffee.')
 ],
 friends:[
  C('New Neighbour','Doorstep',1,'Knock with a basket of cookies and get them to tell you what they do for a living.'),
  C('Stadium','Stadium seats',2,'Get friendly enough that when you go for a drink in five minutes, they ask you to get one for them too.'),
  C('Park Bench','City park',1,'Get on well enough that when they join their two friends, they invite you to play with them.'),
  C('Cafeteria Connection','School cafeteria',1,'Find someone sitting alone, join them and talk until you know their name and class.'),
  C('Club President','Debate club',3,'Approach five people and convince at least three to join your club.')
 ],
 startup:[
  C('Board Pitch','Conference room',3,'Pitch a proposal to the board and win their backing.'),
  C('Shark Tank','Investor panel',3,'Pitch your business to five investors and get at least one to invest.'),
  C('The First Client','New shop',2,'Walk into a newly opened business and convince the owner to make you their supplier.'),
  C('The Difficult Client','Client office',3,'Win over an unhappy client who is thinking of cancelling their contract.'),
  C('The Business Loan','Bank',3,'Present your business plan to the bank manager and secure the loan.')
 ],
 speaking:[
  C('Best Man Toast','Wedding reception',2,'Give a toast that is warm, funny and respectful.'),
  C('Graduation Speech','Graduation hall',2,'Give a speech that moves a hall of graduates and their families.'),
  C('1 vs 5 Debate','Debate room',3,'Debate five opponents one at a time and win at least three of the five.'),
  C('The Difficult Question','Q&A hall',3,'Take questions from an audience that challenges your opinions.'),
  C('The Press Conference','Press room',3,'Face journalists after a controversial incident without losing your composure.')
 ],
 career:[
  C('The Job Interview','Interview room',2,'Interview for Marketing Executive at BrightWave Media and score at least 80%.'),
  C('The Customer Complaint','Electronics store',2,'Handle an angry customer and get her to accept your solution.'),
  C('The Salesperson','Beverage store',1,'Convince a customer to buy at least two bottles of Zest Cola.'),
  C('Deadline Negotiation','Manager\'s office',2,'Get your manager to extend a deadline by two days or cut the workload.'),
  C('The Workplace Mistake','Bank manager\'s office',3,'Own up to sending the wrong report, take responsibility and show a plan to prevent it.')
 ]
};
Object.keys(D).forEach(function(k){D[k].forEach(function(x,i){x.id=i+1;x.cat=k;x.play=!!x.scene})});
window.ReachChallenges={cats:CATS,list:D,order:['toasting','friends','startup','speaking','career']};
})();
