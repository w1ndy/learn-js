#include <iostream>
#include <cstdlib>
#include <string>
#include <map>
#include <vector>
#include <stack>
#include <cassert>
#include <algorithm>
#include <fstream>
using namespace std;

typedef map<wstring, float> word_frequency_t;

#define WORD_MINIMUM 1
#define WORD_MAXIMUM 4

typedef struct tag_state {
    struct tag_state *left_state;
    struct tag_state *right_state;
    float max_value;
    int left, right;
} state_t;

word_frequency_t getWeightedFrequency(wstring const &text)
{
    word_frequency_t freq;
    for(int i = 0; i < text.length() - WORD_MAXIMUM; i++) {
        wstring candidate = L"";
        for(int j = WORD_MINIMUM; j <= WORD_MAXIMUM; j++) {
            assert(i + j <= text.length() && "access violation");
            candidate.push_back(text[i + j - 1]);
            auto it = freq.find(candidate);
            if(it != freq.end())
                it->second += 1.0;
            else
                freq[candidate] = 1.0;
        }
    }
    for(auto &it : freq) {
        int len = it.first.length();
        it.second = it.second * len * len - 0.3;
    }
    return freq;
}

state_t *segment(wstring const &text, word_frequency_t const &freq, state_t *states)
{
    const int len = text.length();
    const int stride = len + 1;
    for(int w = 1; w <= len; w++) {
        wcout << "Current processing length = " << w << endl;
        for(int i = 0; i <= len - w; i++) {
            int j = i + w;
            assert(j <= len && "access violation");
            states[i * stride + j].left = i;
            states[i * stride + j].left_state = NULL;
            states[i * stride + j].right = j;
            states[i * stride + j].right_state = NULL;
            wstring s = text.substr(i, w);
            auto it = freq.find(s);
            if(it != freq.end())
                states[i * stride + j].max_value = it->second;
            else
                states[i * stride + j].max_value = (w > WORD_MAXIMUM ? -5000.0 : 0.0);
            for(int k = i + 1; k < j; k++) {
                if(states[i * stride + k].max_value + states[k * stride + j].max_value > states[i * stride + j].max_value) {
                    states[i * stride + j].max_value = states[i * stride + k].max_value + states[k * stride + j].max_value;
                    states[i * stride + j].left_state = &states[i * stride + k];
                    states[i * stride + j].right_state = &states[k * stride + j];
                }
            }
        }
    }
    return &states[len];
}

word_frequency_t extractTagsFromState(wstring const &text, state_t *s)
{
    word_frequency_t freq;
    stack<state_t *> S;
    stack<int> inst;
    wstring word;
    S.push(s);
    inst.push(0);
    while(!S.empty()) {
        switch(inst.top()) {
            case 0:
                inst.top() = 1;
                if(S.top()->left_state) {
                    S.push(S.top()->left_state);
                    inst.push(0);
                }
                break;
            case 1:
                inst.top() = 2;
                if(S.top()->right_state) {
                    S.push(S.top()->right_state);
                    inst.push(0);
                }
                break;
            case 2:
                if(S.top()->right - S.top()->left >= 2) {
                    auto word = text.substr(S.top()->left, S.top()->right - S.top()->left);
                    auto it = freq.find(word);
                    if(it != freq.end())
                        it->second++;
                    else
                        freq[word] = 1;
                }
                S.pop();
                inst.pop();
                break;
        }
    }
    return freq;
}

void printFrequency(word_frequency_t freq)
{
    vector<pair<wstring, int>> output;
    for(auto &it : freq)
        if(it.second > 1)
            output.push_back(it);
    sort(output.begin(), output.end(), [](pair<wstring, int> const &left, pair<wstring, int> const &right) { return left.second > right.second; });
    for(int i = 0, j = 0; i < output.size(); i++) {
        for(j = 0; j < i; j++) {
            if(output[j].first.find(output[i].first) != wstring::npos || output[i].first.find(output[j].first) != wstring::npos) {
                    j = i + 2;
                    break;
            }
        }
        if(j != i + 2)
            wcout << output[i].first << ": " << output[i].second << endl;
    }
}

wstring readfile(wifstream &fin)
{
    wstring buffer, line;
    while(!fin.eof()) {
        getline(fin, line);
        buffer += line;
    }
    return buffer;
}

int main(int argc, char *argv[])
{
    if(argc != 2) {
        cout << "Usage: " << argv[0] << " [input filename]" << endl;
        cout << "Example: " << argv[0] << " smalltext.in" << endl << endl;
        return 1;
    }

    wifstream fin(argv[1]);
    fin.imbue(locale(locale(), "", LC_CTYPE));
    if(!fin.is_open()) {
        cout << "cannot open " << argv[1] << endl;
        return -1;
    }
    wstring text = move(readfile(fin));
    fin.close();

    wcout.imbue(locale(locale(), "", LC_CTYPE));
    ios::sync_with_stdio(false);
    word_frequency_t freq = move(getWeightedFrequency(text));
    //printFrequency(freq);
    //return 0;
    int len = text.length();
    state_t *states = (state_t *)malloc(sizeof(state_t) * (len + 1) * (len + 1));
    state_t *final = segment(text, freq, states);
    word_frequency_t tags = move(extractTagsFromState(text, final));
    printFrequency(tags);
    return 0;
}
