``words.py`` presents a naive tag extraction O(N^3) algorithm for Chinese text using only text itself.

Example small input (a Chinese material with strong characteristics, extracted from [here](http://www.zhihu.com/question/26956917/answer/51416513))

```
纯干货喜欢请点赞哦答案为原创转载要注明哦作为曾经的星巴克员工江浙沪星巴克属统一旗下其他地区是
星巴克直属的很多东西可能不一样表示你们所谓的高逼格隐藏菜单我们都觉得装逼装过头了什么薄荷糖浆
奇奇怪怪的配料都是没有的常规的只有香草焦糖原味糖浆带一香蕉去星巴克让吧员给你做国内是不可能的
你要加香蕉他要加西瓜榴莲牛油果加些奇奇怪怪的东西万一你拉肚子了谁负责好了回归正题咖啡类本周咖
啡也称本日咖啡新鲜调制咖啡喜欢喝咖啡的如果喜欢纯正的咖啡也就是苦一点的那就点本周一杯还可以免
费加牛奶味道比美式要淡但是本人感觉口感要顺一般默认都是热的热的冰的咖啡豆不一样热本周可以要求
吧员给你加热牛奶虽然麻烦一点但是吧员不会拒绝你的美式最爽的喝法超大冰喜欢喝浓一点的还可以多加
几个浓度加冰不加水之前做咖啡的时候经常有客户投诉为什么我花块买的饮料一大半都是水我喜欢冰块加
满喝到一半的时候再加点免费牛奶又变成拿铁了再加点叫焦糖又没变成焦糖拿铁了有木有这也是前段时间
比较有名的喝法喜欢喝苦的就不用加糖加牛奶了到爆吧拿铁类拿铁有很多种只说好喝的要喝拿铁就喝热的
你说冰的那你为什么不点美式再加免费牛奶我喝过最好喝的是超大杯香草拿铁用大杯装两下糖再加一个浓
度点单的时候不要喘不过气人多的时候不要去星巴克人多的时候不要去星巴克人多的时候不要去星巴克人
多的时候不要去咖啡师已经快死在吧台了你以为他会每杯都打秒钟奶泡也可以试试焦糖拿铁拿铁加奶油都
是不错的选择至于什么行销类拿铁就不要试了全是糖浆奶油甜到爆摩卡类我一般不喝摩卡太腻不过冰摩卡
味道不错值得一试行销类的摩卡也不要点除了摩卡酱可能还会有糖浆糖粉你们看着办吧有人提到我没说卡
布奇诺好吧星巴克的卡布奇诺真的不好喝热的一大半都是泡沫冰的就无力吐槽千万不要点千万不要点还有
焦糖玛奇朵有个非常好听的寓意就是雪地上的印记因为是最后浇在奶泡上的很好看冰的热的都不错但是不
要点冰又去冰这款去冰非常恶心不仅没有了层次的美感焦糖沙司还会像鼻涕虫一样浮在上面茶类饮料柠檬
茶默认的冰摇柠檬茶是要放红茶的星巴克的茶是用茶包泡的但是星巴克的柠檬汁很贵很好喝所以柠檬茶可
以这么点不要茶多一下糖少冰然后这一整杯都是贵到爆的柠檬汁怕酸的人就不要点了或者多几下糖黑加仑
茶我不爱喝所以不说了不要问我有没有热的果汁热的好喝吗红茶拿铁红茶拿铁里没有咖啡拿铁是牛奶的意
思不是咖啡的意思所以红茶拿铁是红茶牛奶也就是奶茶本人超爱喝热的比冰的好喝热的是用红茶包加热水
泡开再加热牛奶中杯大杯都是一个茶杯超大杯是两个茶包
```

Tag extracted (with weights, 1-4 character for a word, weighting function: length * sqrt(length) * frequency):

```
[('变成', 2), ('千万', 2), ('东西', 2), ('饮料', 2), ('行销', 2), ('个浓度', 2),
('味道', 2), ('意思', 2), ('默认', 2), ('到爆', 3), ('免费', 3), ('美式', 3),
('什么', 4), ('摩卡', 5), ('柠檬', 5), ('喜欢', 6), ('时候', 7), ('牛奶', 8),
('星巴克', 10), ('咖啡', 11), ('拿铁', 13)]
```