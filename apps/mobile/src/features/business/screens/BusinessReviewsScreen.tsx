import { useState } from "react";
import { Modal, Pressable, Text, TextInput, View } from "react-native";
import { Screen } from "@/components/ui/Screen";
import { TopBar } from "@/components/ui/TopBar";

const reviews = [
  {
    author: "김**",
    rating: 5,
    text: "분위기 너무 좋아요! 사진 결과물도 만족합니다",
    date: "2026.04.10",
    replied: true,
    reply: "감사합니다! 다음에도 좋은 촬영 하겠습니다.",
  },
  {
    author: "이**",
    rating: 4,
    text: "접근성이 좋고 시설이 깔끔해요",
    date: "2026.04.08",
    replied: false,
  },
  {
    author: "한**",
    rating: 5,
    text: "결과물 퀄리티가 정말 좋습니다. 재방문 예정!",
    date: "2026.03.28",
    replied: true,
    reply: "좋은 리뷰 감사합니다! 또 뵙겠습니다.",
  },
  {
    author: "박**",
    rating: 3,
    text: "가격 대비 보통이었어요",
    date: "2026.03.20",
    replied: false,
  },
];

type ReplyTarget = {
  index: number;
  author: string;
  text: string;
};

export function BusinessReviewsScreen() {
  const [replyTarget, setReplyTarget] = useState<ReplyTarget | null>(null);
  const [replyDraft, setReplyDraft] = useState("");
  const [savedReplies, setSavedReplies] = useState<Record<number, string>>({});

  const closeReplyModal = () => {
    setReplyTarget(null);
    setReplyDraft("");
  };

  const saveReply = () => {
    if (!replyTarget || replyDraft.trim().length < 10) return;
    setSavedReplies((current) => ({ ...current, [replyTarget.index]: replyDraft.trim() }));
    closeReplyModal();
  };

  return (
    <Screen>
      <TopBar title="리뷰 관리" showBack />
      <Text className="mb-3 text-[11px] text-gray-400">소비자 리뷰 등록 후 1주 이내 답글 작성이 가능합니다.</Text>

      <View className="gap-3">
        {reviews.map((review, index) => {
          const savedReply = savedReplies[index];
          const replyText = savedReply ?? review.reply;
          const hasReply = Boolean(replyText);

          return (
            <View key={`${review.author}-${review.date}`} className="rounded-xl bg-gray-50 p-4">
              <View className="mb-2 flex-row items-start justify-between">
                <View className="flex-row items-center">
                  <Text className="text-xs font-medium text-gray-900">{review.author}</Text>
                  <Text className="ml-2 text-xs text-yellow-500">
                    {"★".repeat(review.rating)}
                    {"☆".repeat(5 - review.rating)}
                  </Text>
                </View>
                <Text className="text-[10px] text-gray-400">{review.date}</Text>
              </View>
              <Text className="mb-2 text-xs leading-5 text-gray-600">{review.text}</Text>

              {hasReply ? (
                <View className="rounded-lg border border-gray-100 bg-white p-2.5">
                  <Text className="mb-1 text-[10px] font-medium text-brand-500">업체 답변</Text>
                  <Text className="text-xs leading-5 text-gray-600">{replyText}</Text>
                </View>
              ) : (
                <Pressable
                  className="items-center rounded-lg border border-gray-200 bg-white py-2"
                  onPress={() => {
                    setReplyTarget({ index, author: review.author, text: review.text });
                    setReplyDraft("");
                  }}
                >
                  <Text className="text-xs text-gray-500">답글 작성 (1주 이내)</Text>
                </Pressable>
              )}
            </View>
          );
        })}
      </View>

      <Modal visible={replyTarget !== null} transparent animationType="slide" onRequestClose={closeReplyModal}>
        <Pressable className="flex-1 justify-end bg-black/40" onPress={closeReplyModal}>
          <Pressable className="rounded-t-2xl bg-white p-4 pb-8" onPress={() => {}}>
            <View className="mb-3 flex-row items-center justify-between">
              <Text className="text-sm font-bold text-gray-900">답글 작성</Text>
              <Pressable onPress={closeReplyModal}>
                <Text className="text-lg text-gray-400">×</Text>
              </Pressable>
            </View>

            {replyTarget ? (
              <View className="mb-3 rounded-xl bg-gray-50 p-3">
                <Text className="mb-1 text-[10px] text-gray-400">{replyTarget.author}의 리뷰</Text>
                <Text className="text-xs leading-5 text-gray-600">{replyTarget.text}</Text>
              </View>
            ) : null}

            <TextInput
              value={replyDraft}
              onChangeText={setReplyDraft}
              multiline
              maxLength={300}
              placeholder="리뷰에 대한 답글을 작성해주세요 (10자 이상)"
              placeholderTextColor="#9ca3af"
              className="mb-2 min-h-[104px] rounded-xl border border-gray-200 bg-gray-50 px-3 py-3 text-sm text-gray-900"
            />

            <View className="mb-3 flex-row items-center justify-between">
              <Text className="text-[10px] text-gray-400">작성 후 30일 이내 수정 가능</Text>
              <Text className="text-[10px] text-gray-400">{replyDraft.length}/300</Text>
            </View>

            <View className="flex-row gap-2">
              <Pressable className="flex-1 items-center rounded-xl bg-gray-100 py-3" onPress={closeReplyModal}>
                <Text className="text-sm font-medium text-gray-600">취소</Text>
              </Pressable>
              <Pressable
                className={`flex-1 items-center rounded-xl py-3 ${
                  replyDraft.trim().length >= 10 ? "bg-brand-500" : "bg-gray-200"
                }`}
                disabled={replyDraft.trim().length < 10}
                onPress={saveReply}
              >
                <Text className={`text-sm font-bold ${replyDraft.trim().length >= 10 ? "text-white" : "text-gray-400"}`}>
                  등록
                </Text>
              </Pressable>
            </View>
          </Pressable>
        </Pressable>
      </Modal>
    </Screen>
  );
}
