import re
L=open('../lab/avatar-lab.tpl.html').read().split('\n')
def idx(prefix,start=0):
    for i in range(start,len(L)):
        if L[i].startswith(prefix):return i
    raise Exception(prefix)
a=idx('const T=THREE;'); b=idx('/* ---------- pose (same joint')
c=idx('/* ---------- face bank'); d=idx('let moodV=.25;')
src='\n'.join(L[a+1:b])+'\n'+'\n'.join(L[c:d])
# materials per character
m0=src.index('const MAT={');m1=src.index("['collar','shirtW','tie','belt','skinD'].forEach(k=>MAT[k].side=T.DoubleSide);")+len("['collar','shirtW','tie','belt','skinD'].forEach(k=>MAT[k].side=T.DoubleSide);")
mat=src[m0:m1]
mat=mat.replace('const MAT={','function makeMats(){const MAT={',1)+'\nreturn MAT}\nlet MAT=makeMats();'
src=src[:m0]+mat+src[m1:]
src=src.replace("const ONLY=/*ONLY*/null;","")
# per-character config
src=src.replace("function applyFace(sex,i){const C0=sex==='m'?MAN:FEM,b=FB[sex]","function applyFace(C0,sex,i){const b=FB[sex]")
src=src.replace("function applyBuild(sex,k){const C0=sex==='m'?MAN:FEM,B=BASE[sex]","function applyBuild(C0,sex,k){const B=BASE[sex]")
assert 'applyFace(C0,sex,i)' in src and 'applyBuild(C0,sex,k)' in src
open('avatar_core.js','w').write(src)
print(len(src))
