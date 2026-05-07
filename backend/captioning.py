import functools
from PIL import Image
from transformers import BlipProcessor, BlipForConditionalGeneration
from nltk.translate.bleu_score import sentence_bleu, SmoothingFunction
from rouge_score import rouge_scorer
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity


@functools.lru_cache(maxsize=1)
def load_model():
    """Load and cache the BLIP model (only loaded once)."""
    processor = BlipProcessor.from_pretrained("Salesforce/blip-image-captioning-large")
    model = BlipForConditionalGeneration.from_pretrained("Salesforce/blip-image-captioning-large")
    return processor, model


def generate_caption(image: Image.Image) -> str:
    processor, model = load_model()
    inputs  = processor(image, return_tensors="pt")
    output  = model.generate(**inputs, max_new_tokens=50)
    caption = processor.batch_decode(output, skip_special_tokens=True)[0]
    return caption


def _tokenize(text: str):
    return text.lower().strip().split()


def compute_bleu(reference: str, candidate: str) -> float:
    smoothie = SmoothingFunction().method4
    return sentence_bleu([_tokenize(reference)], _tokenize(candidate), smoothing_function=smoothie)


def compute_rouge(reference: str, candidate: str) -> float:
    scorer = rouge_scorer.RougeScorer(["rougeL"], use_stemmer=True)
    return scorer.score(reference, candidate)["rougeL"].fmeasure


def compute_cider_like(reference: str, candidate: str) -> float:
    vectorizer = TfidfVectorizer()
    tfidf = vectorizer.fit_transform([reference, candidate])
    return cosine_similarity(tfidf[0:1], tfidf[1:2])[0][0]
