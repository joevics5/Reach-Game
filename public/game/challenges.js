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


var WORK_SK=[['opening','Opening'],['listening','Listening'],['clarity','Clarity'],['ownership','Ownership'],['persuasion','Persuasion'],['composure','Composure'],['recovery','Recovery']];
function work(o){
 return {intro:'The player is in a work conversation with you.',scene:function(){return o.scene},style:'Talk like a real professional in this situation',win:o.win,wrap:o.wrap,review:o.review,how:o.how,hidden:o.hidden,feel:o.feel,
  who:function(p,me){return 'WHO YOU ARE: '+o.who+'. '+p.arch.label+'. Stay in this role throughout. The player is a '+me+'. You are a '+p.gender+' and you react as that person naturally would.'},
  extra:'This is a professional conversation. Speak like this person would at work: plain, specific, no flirting.'};
}

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
  C('The Job Interview','Interview room',2,'Interview for Marketing Executive at BrightWave Media and score at least 80%.',{scene:'interview',mode:'seated',picker:{me:true,target:false},maxT:14,winScore:80,minWinTurn:13,skills:WORK_SK,ai:work({
    who:'a hiring manager interviewing a candidate for a Marketing Executive role at BrightWave Media',
    scene:'SCENE: A meeting room at BrightWave Media, Monday 10am. You are interviewing the player for a Marketing Executive role. You have their CV in front of you but you want to hear it from them.',
    feel:'interest is how strongly you would recommend hiring the player (0-100). comfort is how confident you are in their communication and fit. patience is how much time and goodwill you have left.',
    win:'Run a real structured interview, one question at a time: an opener (tell me about yourself), why BrightWave and this role, a strength with an example, a time something went wrong, how they handle a deadline or a difficult colleague, and what questions they have. Follow up on vague answers and ask for specifics. "end" must be null until the final turn; never set "won" in the last two turns before it. At the final turn the interview ends (you thank them and explain next steps) and you decide honestly: set "won" only if you would genuinely recommend them (interest 80 or more and comfort 70 or more); otherwise "declined". Set "left" only if the player is rude and you end the interview early.',
    wrap:function(T){return 'Each player message is marked with its turn number out of '+T+'. Plan about '+T+' exchanges: open, role fit, strength, a setback, teamwork, their questions, close. At turn '+T+' you must end the interview.'},
    review:'a job interview',how:{won:'the interviewer would recommend hiring the player',declined:'the interviewer would not move the player forward',left:'the interviewer ended the interview early',timeout:'the interview ran out of time',player_left:'the player walked out'},
    hidden:function(p){return 'Hidden facts about '+p.name+': a fair but sharp hiring manager at BrightWave Media. She values specific examples over buzzwords, honest answers about mistakes, curiosity about the company, and a clear sense of what the player would do in the role. She dislikes waffling, exaggeration and answers that never get to a result. The player needed an interview score of at least 80 out of 100.'}}),
    persona:{name:'Sarah Mitchell',gender:'woman',age:41,job:'Head of Marketing at BrightWave Media',label:'The fair but sharp interviewer',interest:50,comfort:50,patience:75,mood:'professional and attentive',look:{top:'dress',bottom:'trousers',sh:0x34495E,pn:0x1B1B1B,style:'bun',glasses:true}},
    situation:'You are interviewing for a Marketing Executive position at BrightWave Media. The interviewer, Sarah Mitchell, wants to assess your communication, experience and suitability. You need an interview score of at least 80%.',
    chat:{name:'BrightWave Media',sub:'Interview room, 10am.',who:'Interviewer'},
    pre:'You are shown into the interview room. Sarah Mitchell stands, shakes your hand and gestures to the chair across the desk. Say hello and begin. The interview is about to start.',
    hint:'Give specific examples with a result, not general claims. Show you know what BrightWave does.',
    openCue:function(p){return p.name+' glances at your CV, closes the folder and looks up.'},timeoutCue:function(p){return p.name+' checks the time, stands and thanks you for coming in.'},
    cast:{n:1},go:'Enter the room',placeholder:'Answer Sarah',leave:'End the interview'}),
  C('The Customer Complaint','Electronics store',2,'Handle an angry customer and get her to accept your solution.',{scene:'electronics',mode:'seated',picker:{me:true,target:false},maxT:12,skills:WORK_SK,ai:work({
    who:'an angry customer at an electronics store',
    scene:'SCENE: A busy electronics store on a Saturday morning. You bought a blender three days ago and it has stopped working. You have the box and receipt in a carrier bag. You are at the service counter. You want a refund and you are angry and embarrassed that you have to come back already.',
    feel:'interest is how willing you are to accept what the player offers (0-100, you start very reluctant). comfort is how heard and respected you feel. patience is how much patience you have left before you demand a manager or leave.',
    win:'You start angry and interrupt. You calm down only if the player listens, apologises sincerely without excuses, and offers something concrete. Reward real listening and a clear fix (refund, replacement or repair with a timeline). Punish stalling, blaming you, scripts and promises with no substance. Set "won" only when you have calmed down and genuinely accept a specific solution the player proposed; otherwise keep the conversation going. Set "declined" if you reject the solution and say you will take it further. Set "left" if you storm out or demand a manager.',
    wrap:function(T){return 'Each player message is marked with its turn number out of '+T+'. You do not want to spend the whole morning here: by about turn '+(T-3)+' you want this settled or you will escalate. At turn '+T+' you must end it.'},
    review:'a customer complaint at an electronics store',how:{won:'the customer calmed down and accepted the solution',declined:'the customer rejected the solution and escalated',left:'the customer stormed out',timeout:'the conversation ran out of time',player_left:'the player walked away'},
    hidden:function(p){return 'Hidden facts about '+p.name+': Mrs Williams is angry because a three-day-old blender broke, she wants a refund and feels brushed off. She calms down when she is listened to, apologised to and offered a clear next step. She hates excuses, blame and being passed around.'}}),
    persona:{name:'Mrs Williams',gender:'woman',age:52,job:'school administrator',label:'The angry customer',interest:12,comfort:24,patience:42,mood:'angry and impatient',look:{top:'blouse',bottom:'aline',sh:0x9B59B6,pn:0x2C3E50,style:'bob'}},
    situation:'You work at an electronics store. A customer, Mrs. Williams, bought a blender three days ago, but it stopped working. She is angry and wants a refund. Handle her complaint.',
    chat:{name:'Service counter',sub:'Saturday morning. A queue is forming.',who:'Customer'},
    pre:'Mrs Williams puts a blender box on the counter. She is already talking before you can greet her. You are the person behind the service counter. Say something.',
    hint:'Let her get it out first. Acknowledge how she feels, then offer something specific.',
    openCue:function(p){return p.name+' slams the box on the counter and folds her arms.'},timeoutCue:function(p){return p.name+' looks at the queue behind her and sighs.'},
    cast:{n:1},go:'Open the counter',placeholder:'Reply to Mrs Williams',leave:'Walk away'}),
  C('The Salesperson','Beverage store',1,'Convince a customer to buy at least two bottles of Zest Cola.',{scene:'beverage',mode:'seated',picker:{me:true,target:false},maxT:10,skills:WORK_SK,ai:work({
    who:'a customer in a beverage shop',
    scene:'SCENE: A bright corner beverage shop on a weekday afternoon. You walked in for a cold drink and have not decided what to buy. The player works here and is trying to sell you the shop\'s new soda, Zest Cola.',
    feel:'interest is how tempted you are to buy (0-100). comfort is how relaxed you feel being sold to. patience is how much time you are willing to spend.',
    win:'You are mildly curious but not easy to sell to. You respond to honest, specific selling: taste, a quick comparison with what you usually drink, a fair offer. You dislike hard pressure, big claims and being talked over. Set "won" only when you clearly agree to buy at least two bottles of Zest Cola (say how many, describe paying in "cue"). Set "declined" when you say no and leave politely. Set "left" if the player is pushy and you walk out.',
    wrap:function(T){return 'Each player message is marked with its turn number out of '+T+'. You have about ten minutes before you meet a friend. At turn '+T+' you must make up your mind and end it.'},
    review:'a sales conversation in a beverage shop',how:{won:'the customer agreed to buy at least two bottles',declined:'the customer politely did not buy',left:'the customer walked out',timeout:'the customer ran out of time',player_left:'the player walked away'},
    hidden:function(p){return 'Hidden facts about '+p.name+': Mr Anderson usually buys one familiar cola and is not looking to try anything. He responds to honest, specific selling, a taste offer and a fair deal. He dislikes pressure and exaggeration. The player needed him to buy at least two bottles.'}}),
    persona:{name:'Mr Anderson',gender:'man',age:46,job:'accountant',label:'The comfortable regular',interest:30,comfort:50,patience:65,mood:'relaxed and a little sceptical',look:{top:'polo',bottom:'trousers',sh:0x3498DB,pn:0x34495E,style:'short'}},
    situation:'You work at a beverage company store and are trying to sell its new soda, Zest Cola. A customer, Mr. Anderson, walks in. Convince him to buy at least two bottles.',
    chat:{name:'Zest Corner',sub:'Weekday afternoon. Cold drinks and a bright shop.',who:'Customer'},
    pre:'Mr Anderson walks in and heads for the fridge. You are behind the counter with a display of Zest Cola. Say something before he picks his usual.',
    hint:'Find out what he usually drinks, then connect Zest Cola to it. Offer, do not push.',
    openCue:function(p){return p.name+' wanders over to the fridge and reaches for a familiar bottle.'},timeoutCue:function(p){return p.name+' checks his watch and heads for the till.'},
    cast:{n:1},go:'Open the shop',placeholder:'Say something to Mr Anderson',leave:'Walk away'}),
  C('Deadline Negotiation','Manager\'s office',2,'Get your manager to extend a deadline by two days or cut the workload.',{scene:'office',mode:'seated',picker:{me:true,target:false},maxT:10,skills:WORK_SK,ai:work({
    who:'a busy manager',
    scene:'SCENE: Your office, Wednesday afternoon. You assigned the player a client presentation due tomorrow morning. The player has asked to talk. You know they already have two important assignments due. You have your own pressure from the client.',
    feel:'interest is how open you are to adjusting the deadline or workload (0-100, you start low). comfort is how much you trust the player to deliver. patience is how much time and goodwill you have for this conversation.',
    win:'You are fair but under pressure. You respond to a calm explanation, honest numbers about what the player already has, a concrete proposal (extend by two days, hand off a task, narrow the scope) and ownership. You do not respond to complaining, excuses or vague "I cannot". Set "won" only when you agree to extend the presentation by at least two days or reduce the workload in a specific way. Set "declined" when you refuse and the presentation stays due tomorrow. Set "left" only if the player is rude and you end the meeting.',
    wrap:function(T){return 'Each player message is marked with its turn number out of '+T+'. You have a call with the client soon: by about turn '+(T-2)+' you need an answer. At turn '+T+' you must end it.'},
    review:'a deadline negotiation with a manager',how:{won:'the manager agreed to more time or less work',declined:'the manager refused to change anything',left:'the manager ended the meeting',timeout:'the meeting ran out of time',player_left:'the player left'},
    hidden:function(p){return 'Hidden facts about '+p.name+': Mr Roberts is a busy, fair manager under client pressure. He agrees to changes when the player is calm, specific about what they already have on, proposes a concrete alternative and takes ownership. He dislikes complaining and vagueness. The player needed a two-day extension or a reduced workload.'}}),
    persona:{name:'Mr Roberts',gender:'man',age:49,job:'department manager',label:'The busy, fair manager',interest:22,comfort:48,patience:60,mood:'busy and slightly stressed',look:{top:'dress',bottom:'trousers',sh:0xECF0F1,pn:0x34495E,style:'lowcut',glasses:true}},
    situation:'Your manager, Mr. Roberts, assigns you a client presentation due tomorrow morning. You already have two important assignments due. Explain the situation and negotiate a more realistic deadline.',
    chat:{name:'Mr Roberts\'s office',sub:'Wednesday afternoon.',who:'Manager'},
    pre:'You knock on the open door of Mr Roberts\'s office. He waves you in without looking up from his screen. You asked for five minutes. Begin.',
    hint:'Lead with what you already have due, then give him an option rather than a problem.',
    openCue:function(p){return p.name+' glances up from his screen and nods at the chair.'},timeoutCue:function(p){return p.name+' looks at the time and reaches for his phone.'},
    cast:{n:1},go:'Knock and go in',placeholder:'Say something to Mr Roberts',leave:'Leave the office'}),
  C('The Workplace Mistake','Bank manager\'s office',3,'Own up to sending the wrong report, take responsibility and show a plan to prevent it.',{scene:'bank',mode:'seated',picker:{me:true,target:false},maxT:10,skills:WORK_SK,ai:work({
    who:'a bank manager',
    scene:'SCENE: Your office at Sterling Bank, Thursday morning. An outdated financial report was sent to an important client, who has already noticed the numbers are wrong and phoned you. You called the player in to explain. You are concerned, not yet furious.',
    feel:'interest is how confident you are that the player is reliable and will fix this (0-100, you start low). comfort is how honest and accountable the player seems. patience is how much patience you have left.',
    win:'You listen for honesty, ownership and a plan. You react badly to blame-shifting, minimising, excuses and vague promises. You react well to a clear account of what happened, taking responsibility, how to fix this with the client now, and a specific process change to prevent it. Set "won" only when you are genuinely convinced the player is reliable and the plan is sound. Set "declined" when you are not convinced and say it will be escalated to HR. Set "left" only if the player lies or is rude and you end the meeting.',
    wrap:function(T){return 'Each player message is marked with its turn number out of '+T+'. You have to call the client back soon: by about turn '+(T-2)+' you need to know the plan. At turn '+T+' you must end it.'},
    review:'a meeting about a workplace mistake at a bank',how:{won:'the manager was convinced and trusted the player\'s plan',declined:'the manager was not convinced and escalated it',left:'the manager ended the meeting',timeout:'the meeting ran out of time',player_left:'the player left'},
    hidden:function(p){return 'Hidden facts about '+p.name+': Mr Thompson is a calm, exacting bank manager. He values honesty, ownership and a concrete prevention plan, and he hates excuses, blame and vague promises. The player needed to explain honestly, take responsibility and convince him the problem will not repeat.'}}),
    persona:{name:'Mr Thompson',gender:'man',age:55,job:'branch manager at Sterling Bank',label:'The calm, exacting manager',interest:20,comfort:34,patience:60,mood:'concerned and controlled',look:{top:'suit',bottom:'trousers',sh:0x1B1B1B,pn:0x1B1B1B,style:'bald',glasses:false,beard:false}},
    situation:'You work at Sterling Bank. You accidentally sent an outdated financial report to an important client. Your manager, Mr. Thompson, has called you into his office to explain what happened.',
    chat:{name:'Mr Thompson\'s office',sub:'Thursday morning. Sterling Bank.',who:'Manager'},
    pre:'You are called into Mr Thompson\'s office. He asks you to close the door and sit down. An outdated report went to a major client. He is waiting. Explain.',
    hint:'Say what happened plainly, own it, then show what you will do now and how it will not happen again.',
    openCue:function(p){return p.name+' lays a printed report on the desk and waits.'},timeoutCue:function(p){return p.name+' glances at his phone: the client is calling back.'},
    cast:{n:1},go:'Go in',placeholder:'Say something to Mr Thompson',leave:'Leave the office'})
 ]
};
Object.keys(D).forEach(function(k){D[k].forEach(function(x,i){x.id=i+1;x.cat=k;x.play=!!x.scene})});
window.ReachChallenges={cats:CATS,list:D,order:['toasting','friends','startup','speaking','career']};
})();
