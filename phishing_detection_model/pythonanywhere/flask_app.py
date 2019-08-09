from urllib.parse import unquote
from flask import Flask, jsonify
from flask_cors import CORS
import re
import numpy as np
import pandas as pd


### Global Variables ###
KEYWORD_SPECIFICS_DEFAULT = ["100%", "#1", "$$$", "100% free", "100% satisfied", "50% off", "accept credit cards", "acceptance", "access", "accordingly", "act now", "ad", "additional income", "affordable", "all natural", "all new", "amazed", "amazing", "amazing stuff", "apply now", "apply online as seen on", "auto email removal", "avoid", "avoid bankruptcy", "bargain", "be amazed", "be your own boss", "being a member", "beneficiary", "best price", "beverage", "big bucks", "billing", "billing address", "billion", "billion dollars", "bonus boss", "brand new pager", "bulk email", "buy", "buy direct", "buying judgments cable converter", "call", "call free", "call now", "calling creditors", "can’t live without cancel", "cancel at any time", "cannot be combined with any other offer", "cards accepted", "cash", "cash bonus", "cashcashcash", "casino", "celebrity", "cell phone cancer scam", "cents on the dollar", "certified chance", "cheap", "check", "check or money order", "claims", "claims not to be selling anything claims to be in accordance with some spam law", "claims to be legal", "clearance", "click", "click below", "click here click to remove", "collect", "collect child support", "compare", "compare rates", "compete for your business confidentially on all orders", "congratulations", "consolidate debt and credit", "consolidate your debt", "copy accurately", "copy dvds costs", "credit", "credit bureaus", "credit card offers", "cures", "cures baldness deal", "dear [email/friend/somebody]", "debt", "diagnostics", "dig up dirt on friends", "direct email direct marketing", "discount", "do it today", "don’t delete", "don’t hesitate", "dormant double your", "double your cash", "double your income", "drastically reduced", "earn", "earn $ earn extra cash", "earn per week", "easy terms", "eliminate bad credit", "eliminate debt", "email harvest email marketing", "exclusive deal", "expect to earn", "expire", "explode your business", "extra extra cash", "extra income", "f r e e", "fantastic", "fantastic deal", "fast cash fast viagra delivery", "financial freedom", "financially independent", "for free", "for instant access", "for just $", "for only", "for you", "form", "free", "free access", "free cell phone", "free consultation", "free dvd", "free gift", "free grant money", "free hosting free info", "free installation", "free instant", "free investment", "free leads", "free membership free money", "free offer", "free preview", "free priority mail", "free quote", "free sample free trial", "free website", "freedom", "friend", "full refund", "get get it now", "get out of debt", "get paid", "get started now", "gift certificate", "give it away", "giving away", "great", "great offer", "guarantee", "have you been turned down?", "here", "hidden", "hidden assets", "hidden charges", "home home based", "home employment", "home based business", "human growth hormone", "if only it were that easy", "important information regarding in accordance with laws", "income", "income from home", "increase sales", "increase traffic", "increase your sales incredible deal", "info you requested", "information you requested", "instant", "insurance", "insurance internet market", "internet marketing", "investment", "investment decision", "it’s effective", "join millions", "junk", "laser printer", "leave", "legal", "life insurance", "lifetime", "limited", "limited time", "limited time offer", "limited time only loan", "long distance phone offer", "lose", "lose weight", "lose weight spam", "lower interest rates lower monthly payment", "lower your mortgage rate", "lowest insurance rates", "lowest price", "luxury", "luxury car mail in order form", "maintained", "make $", "make money", "marketing", "marketing solutions mass email", "medicine", "medium", "meet singles", "member", "member stuff message contains", "message contains disclaimer", "million", "million dollars", "miracle", "mlm money", "money back", "money making", "month trial offer", "more internet traffic", "mortgage mortgage rates", "multi-level marketing", "name brand", "never", "new customers only", "no age restrictions", "no catch", "no claim forms", "no cost", "no credit check no disappointment", "no experience", "no fees", "no gimmick", "no hidden", "no hidden costs no interests", "no inventory", "no investment", "no medical exams", "no middleman", "no obligation no purchase necessary", "no questions asked", "no selling", "no strings attached", "no-obligation", "not intended not junk", "not spam", "now", "now only", "obligation", "offshore offer", "offer expires", "once in lifetime", "one hundred percent free", "one hundred percent guaranteed", "one time one time mailing", "online biz opportunity", "online degree", "online marketing", "online pharmacy", "only only $", "open", "opportunity", "opt in", "order", "order now order shipped by", "order status", "order today", "outstanding values", "passwords", "pennies a day per day", "per week", "performance", "phone", "please read", "potential earnings pre-approved", "presently", "price", "print form signature", "print out and fax", "priority mail prize", "problem", "produced and sent out", "profits", "promise", "promise you purchase", "pure profits", "quote", "rates", "real thing", "refinance refinance home", "refund", "removal", "removal instructions", "remove", "removes wrinkles request", "requires initial investment", "reserves the right", "reverses", "reverses aging", "risk free rolex", "round the world", "safeguard notice", "sale", "sample satisfaction", "satisfaction guaranteed", "save $", "save big money", "save up to", "score score with babes", "search engine listings", "search engines", "section 301", "see for yourself", "sent in compliance serious", "serious cash", "serious only", "shopper", "shopping spree", "sign up free", "social security number", "solution", "spam", "special promotion", "stainless steel", "disclaimer statement", "stock pick", "stop", "stop snoring", "strong buy", "stuff on sale subject to cash", "subject to credit", "subscribe", "success", "supplies", "supplies are limited take action", "take action now", "talks about hidden charges", "talks about prizes", "teen", "tells you it’s an ad terms", "terms and conditions", "the best rates", "the following form", "they keep your money — no refund!", "they’re just giving it away this isn’t a scam", "this isn’t junk", "this isn’t spam", "this won’t last", "thousands", "time limited traffic", "trial", "undisclosed recipient", "university diplomas", "unlimited", "unsecured credit unsecured debt", "unsolicited", "unsubscribe", "urgent", "us dollars", "vacation vacation offers", "valium", "viagra", "vicodin", "visit our website", "credit card", "warranty", "we hate spam", "we honor all", "web traffic", "weekend getaway", "weight weight loss", "what are you waiting for?", "what’s keeping you?", "while supplies last", "while you sleep", "who really wins? why pay more?", "wife", "will not believe your eyes", "win", "winner", "winning won", "work from home", "xanax", "you are a winner!", "you have been selected", "your income"]
KEYWORD_SPECIFICS_CUSTOMIZED = ["process", "check out", "give away", "giveaway", "biggest", "flirt", "name", "announcement", "terms", "conditions", "channel", "install", "browse", "enjoy", "mobile content", "sexy", "age", "join", "credit", "downloads", "gender", "ringtone", "dating", "service", "babe", "wet", "porn", "cum", "goodies", "private", "prize", "reply", "topped up", "vid", "video", "pic", "chance", "sale", "cash prize", "worth", "tone", "charge", "topped up", "credit", "credits", "top up", "reply back", "text back"]
KEYWORD_SPECIFICS = KEYWORD_SPECIFICS_DEFAULT + KEYWORD_SPECIFICS_CUSTOMIZED

WEB_URL_REGEX = r"""(?i)\b((?:https?:(?:/{1,3}|[a-z0-9%])|[a-z0-9.\-]+[.](?:com|net|org|edu|gov|mil|aero|asia|biz|cat|coop|info|int|jobs|mobi|museum|name|post|pro|tel|travel|xxx|ac|ad|ae|af|ag|ai|al|am|an|ao|aq|ar|as|at|au|aw|ax|az|ba|bb|bd|be|bf|bg|bh|bi|bj|bm|bn|bo|br|bs|bt|bv|bw|by|bz|ca|cc|cd|cf|cg|ch|ci|ck|cl|cm|cn|co|cr|cs|cu|cv|cx|cy|cz|dd|de|dj|dk|dm|do|dz|ec|ee|eg|eh|er|es|et|eu|fi|fj|fk|fm|fo|fr|ga|gb|gd|ge|gf|gg|gh|gi|gl|gm|gn|gp|gq|gr|gs|gt|gu|gw|gy|hk|hm|hn|hr|ht|hu|id|ie|il|im|in|io|iq|ir|is|it|je|jm|jo|jp|ke|kg|kh|ki|km|kn|kp|kr|kw|ky|kz|la|lb|lc|li|lk|lr|ls|lt|lu|lv|ly|ma|mc|md|me|mg|mh|mk|ml|mm|mn|mo|mp|mq|mr|ms|mt|mu|mv|mw|mx|my|mz|na|nc|ne|nf|ng|ni|nl|no|np|nr|nu|nz|om|pa|pe|pf|pg|ph|pk|pl|pm|pn|pr|ps|pt|pw|py|qa|re|ro|rs|ru|rw|sa|sb|sc|sd|se|sg|sh|si|sj|Ja|sk|sl|sm|sn|so|sr|ss|st|su|sv|sx|sy|sz|tc|td|tf|tg|th|tj|tk|tl|tm|tn|to|tp|tr|tt|tv|tw|tz|ua|ug|uk|us|uy|uz|va|vc|ve|vg|vi|vn|vu|wf|ws|ye|yt|yu|za|zm|zw)/)(?:[^\s()<>{}\[\]]+|\([^\s()]*?\([^\s()]+\)[^\s()]*?\)|\([^\s]+?\))+(?:\([^\s()]*?\([^\s()]+\)[^\s()]*?\)|\([^\s]+?\)|[^\s`!()\[\]{};:"".,<>?«»“”‘’])|(?:(?<!@)[a-z0-9]+(?:[.\-][a-z0-9]+)*[.](?:com|net|org|edu|gov|mil|aero|asia|biz|cat|coop|info|int|jobs|mobi|museum|name|post|pro|tel|travel|xxx|ac|ad|ae|af|ag|ai|al|am|an|ao|aq|ar|as|at|au|aw|ax|az|ba|bb|bd|be|bf|bg|bh|bi|bj|bm|bn|bo|br|bs|bt|bv|bw|by|bz|ca|cc|cd|cf|cg|ch|ci|ck|cl|cm|cn|co|cr|cs|cu|cv|cx|cy|cz|dd|de|dj|dk|dm|do|dz|ec|ee|eg|eh|er|es|et|eu|fi|fj|fk|fm|fo|fr|ga|gb|gd|ge|gf|gg|gh|gi|gl|gm|gn|gp|gq|gr|gs|gt|gu|gw|gy|hk|hm|hn|hr|ht|hu|id|ie|il|im|in|io|iq|ir|is|it|je|jm|jo|jp|ke|kg|kh|ki|km|kn|kp|kr|kw|ky|kz|la|lb|lc|li|lk|lr|ls|lt|lu|lv|ly|ma|mc|md|me|mg|mh|mk|ml|mm|mn|mo|mp|mq|mr|ms|mt|mu|mv|mw|mx|my|mz|na|nc|ne|nf|ng|ni|nl|no|np|nr|nu|nz|om|pa|pe|pf|pg|ph|pk|pl|pm|pn|pr|ps|pt|pw|py|qa|re|ro|rs|ru|rw|sa|sb|sc|sd|se|sg|sh|si|sj|Ja|sk|sl|sm|sn|so|sr|ss|st|su|sv|sx|sy|sz|tc|td|tf|tg|th|tj|tk|tl|tm|tn|to|tp|tr|tt|tv|tw|tz|ua|ug|uk|us|uy|uz|va|vc|ve|vg|vi|vn|vu|wf|ws|ye|yt|yu|za|zm|zw)\b/?(?!@)))"""


### Helper Functions for Feature Extractions ###
def split_to_words(text):
    return [word.strip('!"#$%&\'()*+,-./:;<=>?@[\\]^_`{|}~') for word in text.split(' ')]


def has_phone_number(words):
    for word in words:
        word = re.sub('[- ]', '', word)
        if len(word) > 4 and word.isdigit():
            return 1
    return 0


def length_of_text(words):
    return len(words)


def has_url(text):
    return int(bool(re.search(WEB_URL_REGEX, text)))


def has_math_symbol(text):
    return len(re.findall('[+-<>/^]', text))


def has_dots(text):
    return int('..' in text)


def has_special_symbol(text):
    return len(re.findall('[~!#$&*£]', text))


def has_emoji():  # TODO: Unimplemented as of now.
    pass


def has_keyword_specific(text):
    count = 0
    lowercase_text = text.lower()
    for keyword in KEYWORD_SPECIFICS:
        if keyword in lowercase_text:
            count += 1
    return count


def has_lowercased_word(words):
    for word in words:
        if word.islower():
            return 1
    return 0


def has_uppercased_word(words):
    count = 0
    for word in words:
        if word.isupper():
            count += 1
    return count


class aps_system_predictor():
    def __init__(self):
        pass

    def deserialize(self):
        with open('/home/APSsystem/mysite/rfc.pkl', 'rb') as handle:
            model = pd.read_pickle(handle)
            return model

    def predict(self, message):
        model = self.deserialize()
        features = []

        words = split_to_words(message)
        features.append(has_math_symbol(message))
        features.append(has_url(message))
        features.append(has_dots(message))
        features.append(has_special_symbol(message))
        features.append(has_uppercased_word(words))
        features.append(has_phone_number(message))
        features.append(has_keyword_specific(message))
        features.append(length_of_text(words))

        return model.predict(np.array([features]))


app = Flask(__name__)
CORS(app)


@app.route("/predict/<message>",methods=['GET'])
def predict_phishing(message):
    message = unquote(message)
    predictor = aps_system_predictor()
    result = predictor.predict(message)
    result_dict = {
        'model':'rfc',
        'phishing': str(result[0]),
    }
    return jsonify(result_dict)


@app.route("/",methods=['GET'])
def default():
    return "<h1> Welcome to APS System <h1>"


if __name__ == "__main__":
    app.run()