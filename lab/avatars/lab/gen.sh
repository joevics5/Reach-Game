cd /tmp/claude-0/-home-claude/62eb6b11-02f4-5e94-a560-759e560367ca/scratchpad/lab
sed "s#/\*ONLY\*/null#'m'#" avatar-lab.tpl.html > avatar-male.html
sed "s#/\*ONLY\*/null#'f'#" avatar-lab.tpl.html > avatar-female.html
sed -i 's#<title>Reach Avatar Lab</title>#<title>Reach Male Avatar</title>#;s#<h1>Reach Avatar Lab</h1><p>[^<]*</p>#<h1>Reach Male Avatar</h1><p>Male base character, custom geometry on the game'"'"'s existing joint rig.</p>#' avatar-male.html
sed -i 's#<title>Reach Avatar Lab</title>#<title>Reach Female Avatar</title>#;s#<h1>Reach Avatar Lab</h1><p>[^<]*</p>#<h1>Reach Female Avatar</h1><p>Female base character, custom geometry on the game'"'"'s existing joint rig.</p>#' avatar-female.html
