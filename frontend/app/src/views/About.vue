<template>
  <div class="about">

    <v-container>
      <v-row>
        <v-col cols="12">
          <div class="text-h3">What's Virtual Flower Stand?</div>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12">
          <p class="pa-4">
            誰でも仮想フラワースタンドを作成できるサービスです。COVID-19の影響でオンライン開催を余儀なくされるイベントや祝花を受け付けないイベントが多い中、オタクもオンライン開催に対応する試みとして開発しました。
          </p>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12">
          <div class="text-h5">開発者・管理人</div>
          <v-list dense>
            <v-list-item>
              <v-list-item-content>
                <v-list-item-title class="title">とも</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
            <v-list-item>
              <v-list-item-content>
                <v-list-item-title>e-mail</v-list-item-title>
                <v-list-item-subtitle><a href="mailto:m@sato-t.net">m@sato-t.net</a></v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
            <v-list-item>
              <v-list-item-content>
                <v-list-item-title>LoveLidon! (Mastodon)</v-list-item-title>
                <v-list-item-subtitle><a href="https://mstdn.schoolidol.club/@yazin" target="_blank" rel="noopner">@yazin@mstdn.schoolidol.club</a></v-list-item-subtitle>
                <v-list-item-subtitle>LoveLidon!については<a href="https://mstdn.schoolidol.club/about" target="_blank" rel="moopner">こちら</a>へ</v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
            <v-list-item>
              <v-list-item-content>
                <v-list-item-title>Twitter</v-list-item-title>
                <v-list-item-subtitle><a href="https://twitter.com/yazin" target="_blank" rel="noopner">@yazin</a></v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
          </v-list>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12">
          <div class="text-h5">開発</div>
          <p class="pa-2"><a href="https://github.com/yazin/flowerstand" target="_blank" rel="noopner">GitHubでやってます</a></p>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12">
          <div class="text-h5 pb-2">使い方</div>
          <div class="text-h6">企画者向け</div>
          <v-list>
            <v-list-item>
              <v-list-item-content>
                <v-list-item-title class="title">フラワースタンド作成</v-list-item-title>
                <p class="pa-2">
                  メニューから「フラワースタンド作成」を選択すると作成画面が開きます。なんとなくわかると思うのでノリで埋めてください。<br/>
                  作成が完了すると「管理キー」「参加コード」の2つが発行されます。後で必要になるので必ず記録しておいてください。後からの確認や再発行はできません。<br/>
                  フラワースタンドへの参加者にフラワースタンドのURLと「参加コード」を伝えてください。<br/>
                  「管理コード」は他人に教えないように管理してください。
                </p>
              </v-list-item-content>
            </v-list-item>
            <v-list-item>
              <v-list-item-content>
                <v-list-item-title class="title">フラワースタンド編集</v-list-item-title>
                <p class="pa-2">
                  編集したいフラワースタンドを表示して「情報変更」ボタンをクリックしてください。フラワースタンド作成時に発行された「管理キー」が必要です。<br/>
                  編集画面が開くので、必要な情報を編集してください。フラワースタンドの削除も可能です。
                </p>
              </v-list-item-content>
            </v-list-item>
            <v-list-item>
              <v-list-item-content>
                <v-list-item-title class="title">参加者管理</v-list-item-title>
                <p class="pa-2">
                  編集したいフラワースタンドを表示して「参加者管理」ボタンをクリックしてください。フラワースタンド作成時に発行された「管理キー」が必要です。<br/>
                  参加者一覧画面が開くので、削除したい参加者を選択して「削除」ボタンをクリックすると削除できます。
                </p>
              </v-list-item-content>
            </v-list-item>
          </v-list>
          <div class="text-h6">参加者向け</div>
          <v-list>
            <v-list-item>
              <v-list-item-content>
                <v-list-item-title class="title">フラワースタンドへの参加</v-list-item-title>
                <p class="pa-2">
                  参加したいフラワースタンドを表示して「参加」ボタンをクリックしてください。参加するにはフラワースタンド作成者から教えてもらった「参加コード」が必要です。<br/>
                  参加画面が開くので、名前と希望があれば各SNSのアカウントを入力してください。フラワースタンドの参加者リストに名前が追加されます。<br/>
                  後からの変更や参加取り消しはできません。変更したい場合はフラワースタンド作成者に連絡して一度削除してもらってから再度参加してください。
                </p>
              </v-list-item-content>
            </v-list-item>
          </v-list>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12">
          <div class="text-h5">諸注意</div>
          <v-list dense>
            <v-list-item>
              <v-list-item-content>
                ここにフラワースタンドを出してもキャストさんやスタッフさんが見に来るわけではありません。自己満足としてご利用ください。
              </v-list-item-content>
            </v-list-item>
            <v-list-item>
              <v-list-item-content>
                要望などにはできる範囲で対応したいと思ってはいますが、管理人はこれが本業ではないので何でも対応するのは難しいです。
              </v-list-item-content>
            </v-list-item>
            <v-list-item>
              <v-list-item-content>
                スパムや誹謗中傷などに該当すると管理人が判断した場合は予告なくフラワースタンドを削除する場合があります。なお、フラワースタンド作成者のIPアドレスは記録されていますが、法執行機関からの要請時以外に開示することはありません。
              </v-list-item-content>
            </v-list-item>
          </v-list>
        </v-col>
      </v-row>
      <v-row cols="12">
        <v-col cols="12">
          <div class="text-h5">FAQ</div>
          <v-list>
            <v-list-item>
              <v-list-item-content>
                <div class="title">削除キーと参加コードを忘れた</div>
                <p class="pa-2">
                  メール・Mastodon・Twitterにて管理人にお問い合わせください。というかそもそも忘れないでください。
                </p>
              </v-list-item-content>
            </v-list-item>
            <v-list-item>
              <v-list-item-content>
                <div class="title">悪意のある／不適切なフラワースタンドを見つけた</div>
                <p class="pa-2">
                  メール・Mastodon・Twitterにて管理人に通報してください。確認の上しかるべき対処を行います。とはいえ管理人決して暇ではないので対処にしばらく時間がかかる場合があります。
                </p>
              </v-list-item-content>
            </v-list-item>
            <v-list-item>
              <v-list-item-content>
                <div class="title">イベント登録は自分でできないの？</div>
                <p class="pa-2">
                  重複登録やラブライブ！と無関係なイベントの登録などの無秩序化を警戒してユーザーによるイベント登録機能は提供していません。<br/>
                  管理人が登録するまでお待ちください。
                </p>
              </v-list-item-content>
            </v-list-item>
            <v-list-item>
              <v-list-item-content>
                <div class="title">ユーザー登録機能はないの？</div>
                <p class="pa-2">
                  ID、パスワード、各種個人情報を預かるには適切なセキュリティ要件を満たし、また厳格な認証機構を実装する必要がありますが、このシステムでそこまで頑張る必要性を感じなかったので個人情報は預からないことにしてユーザー登録機能は実装していません。
                </p>
              </v-list-item-content>
            </v-list-item>
            <v-list-item>
              <v-list-item-content>
                <div class="title">こんな機能欲しいんだけど</div>
                <p class="pa-2">
                  GitHubでプルリクかissueください。
                </p>
              </v-list-item-content>
            </v-list-item>
            <v-list-item>
              <v-list-item-content>
                <div class="title">この挙動はバグでは？ この表記は誤字脱字では？</div>
                <p class="pa-2">
                  GitHubでプルリクかissueください。
                </p>
              </v-list-item-content>
            </v-list-item>
            <v-list-item>
              <v-list-item-content>
                <div class="title">サイトデザイン殺風景すぎね？</div>
                <p class="pa-2">
                  管理人はWebデザイナーでもフロントエンドエンジニアでもないのでこの程度が限度です。それっぽくできる人はGitHubでプルリクください。
                </p>
              </v-list-item-content>
            </v-list-item>
            <v-list-item>
              <v-list-item-content>
                <div class="title">Saint Snowのイベントに諏訪ななかさん宛のフラスタが出せるんだけど？</div>
                <p class="pa-2">
                  出せますが出さないでください。<br/>
                  各イベントの出演者はデータ管理の複雑性を抑制するために個人単位ではなくグループ単位でマッピングしているため、例えばμ'sが出演するイベントで9人全員でなく一部メンバーだけが出演する場合でも、出演しないメンバーに対してもフラワースタンドを贈ることができるのが現時点での仕様です。<br/>
                  繰り返します。出さないでください。あなたの良心に感謝します。
                </p>
              </v-list-item-content>
            </v-list-item>
            <v-list-item>
              <v-list-item-content>
                <div class="title">作ったフラスタをキャストさんに見てほしいんだけど、ここのURLを送っても大丈夫？</div>
                <p class="pa-2">
                  本サイト自体には権利侵害にあたる要素はない認識ですが、作成者がアップロードした画像は多くが二次創作物になるかと思います。<br/>
                  通常の同人活動の例に倣い、キャストさんやスタッフさんに直接ここのURLを送り付ける行為はご遠慮ください。<br/>
                  Twitterなどで本サイトや作成したフラスタについて普通に話題にしていれば好奇心旺盛なクアッカワラビーは勝手に寄ってくるでしょう。
                </p>
              </v-list-item-content>
            </v-list-item>
            <v-list-item>
              <v-list-item-content>
                <div class="title">AZALEAの花の色はピンクだろ！</div>
                <p class="pa-2">
                  <span class="text-decoration-line-through">まだピンクにしちゃ駄目</span>
                  この手の解釈違い全てに対応することはできないので用意されたものから選んでください。
                </p>
              </v-list-item-content>
            </v-list-item>
            <v-list-item>
              <v-list-item-content>
                <div class="title">ことうみ？</div>
                <div class="title">かなりこ？</div>
                <div class="title">しずかす？</div>
                <p class="pa-2">
                  管理人の趣味です。
                </p>
              </v-list-item-content>
            </v-list-item>
            <v-list-item>
              <v-list-item-content>
                <div class="title">にこまきください</div>
                <div class="title">よしりこください</div>
                <div class="title">じもあいください</div>
                <div class="title">あいりなください</div>
                <p class="pa-2">
                  カップリングは解釈により無限に増え続けるので対応しません。
                </p>
              </v-list-item-content>
            </v-list-item>
            <v-list-item>
              <v-list-item-content>
                <div class="title">ことりと善子と理亞と璃奈が同じ色に見える</div>
                <p class="pa-2">
                  ごめんなさい白だけは許してください。正確な色指定の資料がないので・・・。
                </p>
              </v-list-item-content>
            </v-list-item>
            <v-list-item>
              <v-list-item-content>
                <div class="title">だからヨハネよっ！</div>
                <p class="pa-2">
                  ぴょん
                </p>
              </v-list-item-content>
            </v-list-item>
            <v-list-item>
              <v-list-item-content>
                <div class="title">サーバー運用費とか開発保守作業とか大変じゃないの？</div>
                <p class="pa-2">
                  大変です。よければこちらからコーヒーでもおごってください。</p>
                <div class="pa-2">
                  <a href='https://ko-fi.com/K3K72GPJM' target='_blank' rel="noopener"><img height='36' style='border:0px;height:36px;' src='https://cdn.ko-fi.com/cdn/kofi4.png?v=2' border='0' alt='Buy Me a Coffee at ko-fi.com' /></a>
                </div>
              </v-list-item-content>
            </v-list-item>
          </v-list>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12">
          <div class="text-h5">素材</div>
          <p class="pa-2">
            フラワースタンドの元画像にはイラストACのイラスト素材を使用しています。<br/>
            <a href="https://www.ac-illust.com/main/detail.php?id=87614&word=%E3%82%B9%E3%82%BF%E3%83%B3%E3%83%89%E3%83%95%E3%83%A9%E3%83%AF%E3%83%BC" target="_blank" rel="noopener">https://www.ac-illust.com/main/detail.php?id=87614&word=%E3%82%B9%E3%82%BF%E3%83%B3%E3%83%89%E3%83%95%E3%83%A9%E3%83%AF%E3%83%BC</a>
          </p>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>
