// Static HTML shell for the game screens. The game script in public/game/game.js binds to these ids.
export const MARKUP = `<div class="app">
  <div class="top">
    <div class="brand"><i></i>Reach</div>
    <div class="topbtns"><button class="ghost" id="gear" aria-label="Settings">Settings</button><button class="ghost" id="back" hidden>Back</button></div>
  </div>

  <section class="screen" id="s-dash">
    <div class="hero">
      <div class="eyebrow">A social simulation</div>
      <h1>Say something.<br>See what happens.</h1>
      <p class="lede">Walk into real situations, talk to characters who have their own moods and limits, and find out how it went.</p>
    </div>
    <div class="cards">
      <button class="card t" data-cat="toasting"><div class="eyebrow">Romance</div><h2>Rizz</h2><p>Approach someone you like and see where the conversation goes.</p><div class="meta"><span class="pill c" id="p-toasting">0 of 20</span><span class="pill">1 playable</span></div><div class="num">20</div></button>
      <button class="card f" data-cat="friends"><div class="eyebrow">Friendship</div><h2>Make Friends</h2><p>Meet strangers, join groups, and turn a hello into a friend.</p><div class="meta"><span class="pill c" id="p-friends">0 of 20</span><span class="pill">Coming soon</span></div><div class="num">20</div></button>
    </div>
    <div class="how">
      <div><b>Walk in, then talk</b>Each challenge is a 3D place. You decide who to approach and when.</div>
      <div><b>No script</b>Type or dictate what you would really say. The character answers as a person would.</div>
      <div><b>Scored in secret</b>You see how it went at the end, with the moments that mattered.</div>
    </div>
  </section>

  <section class="screen" id="s-list" hidden>
    <div class="lh" id="lh"></div>
    <div class="rows" id="rows"></div>
  </section>

  <section class="screen" id="s-brief" hidden>
    <div class="brief" id="brief"></div>
  </section>

  <section class="screen" id="s-play" hidden>
    <div class="play">
      <div class="stage" id="stage">
        <canvas id="gl" aria-label="3D bar"></canvas>
        <div class="goal"><div class="g" id="goal"></div><div class="badge" id="gbadge"></div></div>
        <button id="talk">Talk</button>
        <div id="joy" aria-label="Move"><i></i></div>
        <div class="tip" id="tip">Drag to move. Swipe the view to look around.</div>
      </div>
      <div class="chat" id="chat">
        <div class="ch-h"><div><b id="chname">The bar</b><div class="sub" id="chsub"></div></div><div class="time" id="timebox" hidden><small>Her time</small><div class="prog"><i id="timebar"></i></div></div></div>
        <div class="log" id="log"></div>
        <div class="hint" id="hint" hidden></div>
        <div class="err" id="err" hidden></div>
        <div class="acts" id="acts" hidden><button class="ghost" id="walkaway">Walk away</button><span class="note" id="micnote"></span></div>
        <div class="comp" id="comp" hidden>
          <button class="ib" id="mic" aria-label="Speak instead of typing"><svg viewBox="0 0 24 24"><path d="M12 15a3 3 0 0 0 3-3V6a3 3 0 0 0-6 0v6a3 3 0 0 0 3 3zm5-3a5 5 0 0 1-10 0H5a7 7 0 0 0 6 6.9V22h2v-3.1A7 7 0 0 0 19 12h-2z"/></svg></button>
          <textarea id="msg" rows="1" maxlength="280" placeholder="Say something to her" aria-label="Your message"></textarea>
          <button class="ib send" id="send" aria-label="Send"><svg viewBox="0 0 24 24"><path d="M3 20.5 21 12 3 3.5l.01 6.6L15 12 3.01 13.9z"/></svg></button>
        </div>
      </div>
    </div>
  </section>

  <section class="screen" id="s-settings" hidden>
    <div class="brief" id="settings"></div>
  </section>

  <section class="screen" id="s-review" hidden>
    <div class="rv" id="rv"></div>
  </section>
</div>`;
