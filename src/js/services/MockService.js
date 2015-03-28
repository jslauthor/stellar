var reviewAction = require('../actions/ReviewAction')

module.exports = {
    init: function() {
        reviewAction.addReview("http://www.amazon.com/Modern-Rituals-Wayward-Supernatural-Thriller-ebook/dp/B00ROPEBKE/ref=cm_cr_pr_product_top?ie=UTF8");
        reviewAction.addReview("http://www.amazon.com/The-Hunger-Games/dp/B001H97LLY/ref=tmm_aud_swatch_0?_encoding=UTF8&sr=8-1&qid=1427292167");
        reviewAction.addReview("http://www.amazon.com/The-Giver-Quartet-Lois-Lowry/dp/0544336267/ref=pd_sim_b_4?ie=UTF8&refRID=1342KTHH1J92SNZSS14P");
        reviewAction.addReview("http://www.amazon.com/Master-Magician-Paper-Book-ebook/dp/B00P1NO3G8/ref=sr_1_3?s=digital-text&ie=UTF8&qid=1427200609&sr=1-3");
        reviewAction.addReview("http://www.amazon.com/The-User-Experience-Team-One/dp/1933820187/ref=pd_rhf_ee_s_cp_15_MH68?ie=UTF8&refRID=1BNBHPJ3G9ERXT26TSFZ");
        reviewAction.addReview("http://www.amazon.com/Carlotas-Legacy-Jewel-Trilogy-Book-ebook/dp/B0029ZARU2/ref=sr_1_50?s=digital-text&ie=UTF8&qid=1427200339&sr=1-50");
        reviewAction.addReview("http://www.amazon.com/gp/product/B00IS619X0/ref=s9_ps_bw_d19_g351_i5?pf_rd_m=ATVPDKIKX0DER&pf_rd_s=merchandised-search-4&pf_rd_r=0YMNWP6SVAKP6ZJ4EGK6&pf_rd_t=101&pf_rd_p=1721688422&pf_rd_i=154606011");
    }
}