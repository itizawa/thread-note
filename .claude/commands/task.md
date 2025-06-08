gh issue list でGitHubのIssueを確認し、ラベル「For Claude」が付いているIssueのタスクの遂行を行なってください。
タスクは以下の手順で進めてください。

1. Issueの一覧からラベル「For Claude」のものを1つ見つける
2. gh issue view #{{Issueの番号}} にてIssueに記載されている内容を理解する
3. mainにチェックアウトし、pullを行い、最新のリモートの状態を取得する
3. Issueの内容を元に、適切な命名でブランチを作成、チェックアウトする
4. Issueの内容を実現するために必要なタスクを実行する
5. 適切なテストを追加する
6. テストとLintを実行し、すべてのテストが通ることを確認する
7. コミットを適切な粒度で作成する
8. PRを作成する。なお、PRのdescriptionには`Closes #$ARGUMENTS`と冒頭に記載すること
