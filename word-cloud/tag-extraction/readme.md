``words.py`` presents a naive tag extraction O(N^3) algorithm for Chinese text using only text itself.

Example small input (a Chinese material with strong characteristics, extracted from [here](http://www.zhihu.com/question/26956917/answer/51416513))

```
See smalltext.in
```

Tag extracted from the material above (with weights, 1-4 character for a word, weighting function: length * sqrt(length) * frequency):

```
[('变成', 2), ('千万', 2), ('东西', 2), ('饮料', 2), ('行销', 2), ('个浓度', 2),
('味道', 2), ('意思', 2), ('默认', 2), ('到爆', 3), ('免费', 3), ('美式', 3),
('什么', 4), ('摩卡', 5), ('柠檬', 5), ('喜欢', 6), ('时候', 7), ('牛奶', 8),
('星巴克', 10), ('咖啡', 11), ('拿铁', 13)]
```

Tag extracted from the material above (with weights, 1-4 character for a word, weighting function: length * length * frequency, using large text as frequency dictionary):

```
[('默认', 2), ('行销', 2), ('饮料', 2), ('香草', 2), ('东西', 2), ('千万', 2),
('卡布奇诺', 2), ('变成', 2), ('意思', 2), ('美式', 3), ('本周', 3), ('免费', 3),
('什么', 4), ('摩卡', 5), ('可以', 5), ('柠檬', 5), ('喜欢', 6), ('时候', 7),
('牛奶', 8), ('星巴克', 10), ('咖啡', 11), ('拿铁', 13)]
```

``words.cpp`` provides a lot faster and optimized implementation in C++. Simply compile using ``g++ words.cpp -o words -std=c++11 -O3`` and launch the binary with the file name (samples attached, ``smalltext.in`` and ``largetext.in``, or supply your own data using ``clean.py`` script to remove unicode punctuations). Results produced by this implementation (confidence >= 5, using weight function: frequency * length * length - 0.3, ignores overlapped tags and prefers short defined words over long ones in segmentation):

```
拿铁: 13
咖啡: 11
星巴克: 10
牛奶: 8
不要: 8
焦糖: 6
喜欢: 6
红茶: 6
柠檬: 5
摩卡: 5
可以: 5
```

Results produced using large text as input (confidence >= 10):

```
咖啡: 58
星巴克: 41
可以: 27
牛奶: 24
拿铁: 24
什么: 22
喜欢: 15
时候: 14
美式: 13
觉得: 12
本周: 12
兼职: 10
免费: 10
饮料: 10
```

Results produced for [a news article](http://news.163.com/15/0704/07/ATLQ313K00011229.html) (confidence >= 7):

```
大学: 96
简称: 35
教育: 19
章程: 14
南大: 11
商标: 9
南昌: 8
注册: 8
核准: 7
江西省: 7
```
