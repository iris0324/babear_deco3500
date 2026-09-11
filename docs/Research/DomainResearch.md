# Background and Domain Research

## 1. Background

Our project explores how **Social and Mobile Computing (SOMO)** can support engagement in physical art galleries.

Art galleries provide many forms of information, such as wall labels, audio guides, and digital guides. These resources can help visitors learn about artists and artworks. However, receiving more information does not always mean that visitors are actively looking, interpreting, or reflecting on the artwork.

This problem may be more noticeable for casual or less-experienced visitors. These visitors may be interested in art, but they may not know where to begin when looking at an unfamiliar artwork. They may also feel unsure about whether their own interpretation is "correct". Because of this, they may depend on labels or expert explanations instead of forming their own ideas.

Our project therefore focuses on two relationships:

- The relationship between **visitors and physical artworks**
- The relationship between **different gallery visitors**

Our current target audience is casual and less-experienced gallery visitors, especially people who have limited art knowledge or low confidence in expressing their own interpretations.

---

## 2. Domain Research

### 2.1 Less-Experienced Visitors May Lack Confidence

One important issue is that some visitors may not feel confident interpreting art.

Shaer et al. (2011) found that beginning museum visitors often moved through galleries quickly, briefly looked at artworks, and sometimes relied on labels. They also found that beginning visitors could feel uncomfortable forming or sharing their own opinions.

This suggests that low engagement does not always mean low interest. A visitor may already have a feeling or idea about an artwork, but they may not trust their own response.

**Evidence chain:**

> Limited art experience  
> → Uncertainty about interpretation  
> → Low confidence  
> → Stronger reliance on labels or expert information  
> → Less active personal interpretation

**Design implication:**  
The experience should not ask visitors to produce a "correct" interpretation. Instead, it should give them an easy starting point and allow personal responses.

---

### 2.2 Gallery Viewing Can Become Passive

A common gallery experience can become:

> **Look → Read → Move on**

Visitors may briefly look at an artwork, read the label, and continue to the next work. This gives them fewer opportunities to notice details, ask questions, or form their own interpretation.

Shaer et al. (2011) explored this problem through **ARTeMuse**. The system used simple questions and activities to encourage visitors to look more carefully at artworks. Their study found that visitors spent more time with individual artworks and showed deeper analysis and opinion formation.

This suggests that visitors may not always need more information. They may need a reason to **stop, notice, and think**.

A more active experience could be:

> **Look → Notice → Question → Interpret → Reflect**

**Design implication:**  
Technology should support active looking rather than only provide more information.

---

### 2.3 Expert Information Is Useful, but It Is Not the Only Form of Interpretation

Traditional museum interpretation often follows this structure:

> **Museum / Expert → Information → Visitor**

Wall labels and digital guides are useful because they provide background knowledge. However, they usually focus on information created by museums, curators, or experts.

Yi et al. (2022) explored a different type of information called **Visitor-Based Social Contextual Information (VSCI)**. This included visitors' emotions, behaviours, evaluations, and comments.

Their study showed that visitors could compare their own responses with other people's perspectives and discover different ways of understanding the same artwork.

This creates an important difference:

> **Expert information helps explain the artwork.**

while:

> **Visitor perspectives show how the artwork can be understood in different ways.**

**Design implication:**  
Other visitors should not replace expert information. Their perspectives can provide an additional layer of interpretation.

---

### 2.4 Other Visitors Can Become Resources for Interpretation

Art interpretation does not always happen alone.

Eklund (2020) found that museum visitors can create meaning through shared knowledge, play, and connections between museum objects and familiar experiences.

Ryding et al. (2021) also found that interpersonal museum experiences can create space for visitors to develop their own interpretations.

These studies suggest that another visitor can offer something different from an expert explanation. They can show:

> "This is what I noticed."

or:

> "This is how this artwork made me feel."

Another person's perspective may cause a visitor to look again and notice something new.

However, this does not mean visitors always want to talk directly to strangers. Visitors may benefit from other people's perspectives without needing direct face-to-face interaction.

**Evidence chain:**

> Personal interpretation  
> → Encounter another visitor's perspective  
> → Compare ideas  
> → Notice a difference  
> → Return attention to the artwork  
> → Reflect again

**Design implication:**  
The experience should make other visitors' perspectives visible while keeping social interaction low-pressure.

---

### 2.5 Social Interaction Should Not Create Unnecessary Pressure

Direct conversation can support gallery engagement, but it can also feel uncomfortable.

This may be especially important for solo visitors or people who do not feel confident discussing art.

Therefore, our project is interested in **low-pressure social interaction**.

Visitors should be able to experience another person's perspective without needing to:

- Reveal their identity
- Create a public profile
- Directly approach a stranger
- Explain their interpretation face-to-face

Our current direction uses **indirect and asynchronous interaction**. A visitor can leave a visual detail, clue, and interpretation for someone who visits later. The two visitors do not need to be in the gallery at the same time.

**Design implication:**  
Social interaction should be optional, anonymous, and indirect when possible.

---

### 2.6 Mobile Technology Should Return Attention to the Artwork

Mobile technology can support museum engagement, but it can also create distraction.

Sung et al. (2010) found that electronic guides can compete with physical exhibits for visitors' attention.

Stanković Elesini et al. (2022) also discussed problems such as head-down behaviour, isolation, and reduced conversation. However, their research suggests that mobile activities connected to the physical museum environment can also support active engagement.

Therefore, the problem is not simply whether visitors use a phone.

The more useful question is:

> **What does the technology encourage the visitor to do?**

If technology encourages the visitor to keep reading a screen, it may compete with the artwork.

If it encourages the visitor to:

> **Move → Search → Look closely → Compare → Look again**

then the digital interaction can become a bridge back to the physical gallery.

**Design implication:**  
Technology should guide visitors back to physical artworks instead of becoming the main focus of the experience.

---

## 3. Competitor Analysis

We also reviewed existing systems and design research in museums and galleries.

The aim was to understand how previous projects have supported interpretation, social interaction, and engagement, and to identify areas that are still useful for us to explore.

| System | What It Does | What Works Well | Gap We Identified | What We Can Learn |
|---|---|---|---|---|
| **ARTeMuse** (Shaer et al., 2011) | A deployed social-mobile system using questions and activities to help beginning visitors engage with artworks. | Gives visitors a clear starting point and encourages closer observation and opinion formation. | Its main focus is guided questions and activities. It gives us less information about how one visitor's interpretation could become part of another visitor's experience. | Simple prompts can lower the starting barrier and encourage less-experienced visitors to interpret artworks. |
| **VSCI** (Yi et al., 2022) | A study of visitor-based social contextual information, including visitor opinions, emotions, evaluations, and comments. | Makes other visitors' perspectives visible and allows visitors to compare different responses. | We see a risk that visitor-generated information could become another layer to read if the interaction does not encourage visitors to actively compare or return to the artwork. | Showing other perspectives can support interpretation, but the interaction should encourage reflection rather than only information consumption. |
| **Gift** (Ryding et al., 2021) | A design case in which one visitor creates a personalised museum experience for another person using selected objects and personal messages. | One person's choices can influence another person's museum experience even when they are not experiencing it in exactly the same way. | The experience is built around a relationship between the people involved, which may not apply to casual visitors who do not know each other. | One visitor can leave something meaningful that shapes another visitor's later experience. |
| **Never Let Me Go** (Ryding et al., 2021) | A design case where one participant influences another participant's museum experience through prompts and actions. | Shows how interpersonal interaction can change attention and how people experience museum objects. | The experience is designed around a paired and relatively intimate interaction, which is different from a casual gallery visit involving unrelated visitors. | Social influence can change what visitors notice, but the level of interaction needs to fit the gallery context. |
| **Sotto Voce** (Aoki et al., 2002) | A deployed system that allows museum companions to share parts of an audio guide. | Uses technology to support conversation and shared attention instead of creating two completely separate digital experiences. | It mainly supports people who are already visiting together, rather than connections between unrelated visitors. | Technology can support shared attention around physical museum objects. |
| **In-Gallery Social Interpretation Platform** (Winter, 2019) | A **proposed system and requirements study**, rather than a deployed and evaluated system. It explores requirements for a platform where visitors could contribute and respond to interpretations in a gallery. | Identifies the value of giving visitors a voice and considering visitor-generated interpretation as part of the gallery experience. | Because it is a requirements study, it does not provide results from a deployed system. It also raises design issues around participation, moderation, ownership, and attention. | Visitor-generated interpretation is worth exploring, but an actual implementation needs to consider how participation and digital attention are managed. |

### 3.1 What We Learned from Existing Systems

The competitor analysis showed that there is no single approach to supporting gallery engagement.

ARTeMuse shows the value of giving less-experienced visitors a simple starting point. VSCI shows the value of making visitor perspectives visible. Gift and Never Let Me Go show that one person's actions can shape another person's museum experience. Sotto Voce shows that technology can support shared attention around physical objects.

At the same time, we identified several gaps across these examples.

First, many systems either provide guided activities or display information. There is still room to explore how visitors can first form their **own interpretation** and then use another person's perspective to reflect further.

Second, many social museum experiences focus on people who already know each other or participate as a pair. This leaves room to explore lighter forms of connection between visitors who are not together.

Third, digital systems need to carefully manage attention. Making more social information available is not automatically useful if visitors spend more time reading the interface than looking at the artwork.

These gaps helped us move from broad domain research toward a clearer set of problems.

---

# 4. Problems Identified

Based on the domain research, literature, and competitor analysis, we identified five connected problems.

## Problem 1 — Some visitors may lack confidence in their own interpretation

Less-experienced visitors may have thoughts about artworks, but they may feel unsure about whether those thoughts are valid.

### Evidence

Shaer et al. (2011) found that beginning visitors could feel uncomfortable forming or sharing opinions.

### Analysis

This suggests that the issue is not always a lack of interest.

Some visitors may already be thinking, but they do not feel confident enough to express what they think.

### Design opportunity

Support visitors in forming a personal interpretation without requiring expert knowledge.

---
## Problem 2 — Gallery engagement can become passive

Some visitors may follow a simple pattern:

> **Look → Read → Move on**

### Evidence

Shaer et al. (2011) showed that prompts and activities can increase time spent with artworks and support deeper analysis.

### Analysis

This suggests that visitors may need an active reason to stop and observe.

More information alone may not solve the problem.

### Design opportunity

Create an interaction that encourages visitors to notice details, ask questions, and return attention to the artwork.

---

## Problem 3 — Other visitors' perspectives are often invisible

Visitors may physically share the same gallery space, but they often do not know how other people interpret the same artwork.

### Evidence

Yi et al. (2022), Eklund (2020), and Ryding et al. (2021) suggest that other visitors' reactions and perspectives can support comparison and meaning-making.

### Analysis

This means other visitors are not only people sharing the same space.

Their perspectives can become a resource.

However, simply showing a comment feed may still create passive reading.

### Design opportunity

Make visitor perspectives visible in a way that encourages active comparison and reflection.

---

## Problem 4 — Direct social interaction may create pressure

Social interaction can support interpretation, but not every visitor wants to talk to strangers.

### Evidence

The literature shows the value of social interpretation, but it does not mean direct conversation is always needed.

### Analysis

A gallery is often a quiet and personal environment.

If interaction feels too public or forced, some visitors may avoid it.

### Design opportunity

Explore optional, anonymous, indirect, or asynchronous forms of social interaction.

---

## Problem 5 — Mobile technology can distract from artworks

Digital tools can support the visit, but they can also take attention away from the physical artwork.

### Evidence

Sung et al. (2010) found that electronic guides can compete with exhibits for attention.

Stanković Elesini et al. (2022) also discussed head-down behaviour and isolation.

### Analysis

This creates a design tension.

Technology is useful, but it should not become the main thing visitors look at.

### Design opportunity

Use technology to guide visitors back to the physical artwork.

---
## 5. Research Synthesis and Design Opportunity

The five problems are connected rather than separate.

### 5.1 Confidence and Active Interpretation

One pattern we identified is:

> **Limited art experience may relate to lower interpretation confidence → greater reliance on existing interpretation → fewer opportunities to develop a personal response → more passive engagement**

The literature does not prove this entire sequence as a causal relationship. It is our interpretation built from the findings of Shaer et al. (2011), and it needs to be further explored through our own research.

The important point for our project is that **engagement may involve confidence as well as knowledge**.

If this is true, giving visitors more information is only one possible response. Supporting them in noticing, thinking, and forming their own interpretation may be equally important.

### 5.2 Other Visitors as an Interpretation Resource

A second pattern comes from the social side of the research:

> **Visitors have different perspectives → these perspectives can support comparison → comparison may encourage new observations or reflection**

The first part is supported by research such as Yi et al. (2022), while the full sequence is our design reasoning.

This creates an opportunity to treat visitor-generated perspectives as more than comments.

A visitor's response could become something that another visitor actively compares with their own experience of the artwork.

### 5.3 Social Connection Without Assuming Direct Conversation

The literature shows that social and interpersonal museum experiences can support meaning-making, but existing systems use different levels of social interaction.

For our project, this means we should not begin with the assumption that visitors need to directly talk to each other.

Instead, we can explore how **awareness, traces, indirect interaction, asynchronous interaction, and direct interaction** create different experiences.

Which level works best for our target users is still a research question.

### 5.4 Technology as a Bridge Back to the Artwork

Finally, mobile technology creates both an opportunity and a risk.

It can connect visitors with activities and other perspectives, but it can also compete with physical artworks for attention.

For our project, a useful role for technology may therefore be:

> **Digital interaction → physical action → closer observation → reflection**

rather than:

> **Artwork → screen → more screen content**

This gives us an important principle for later design development: the physical artwork should remain the centre of the experience.

---

### Overall Design Opportunity

Bringing these findings together, our design opportunity is:

> **How might social and contextual interaction support casual and less-experienced gallery visitors in forming their own interpretations, becoming aware of other visitors' perspectives, and engaging more actively with physical artworks — through a low-pressure social experience that keeps attention on the artwork itself?**

At this stage, this statement defines the **problem space**, not the final solution.

Our next step is to use user research and prototyping to test the assumptions inside this problem space, including:

- whether less-experienced visitors actually experience low interpretation confidence
- whether seeing another visitor's perspective supports reflection
- what level of social interaction visitors are comfortable with
- how much digital interaction can be used without distracting from the artwork

These findings will then inform our experience requirements and later design decisions.

---

## References

Aoki, P. M., Grinter, R. E., Hurst, A., Szymanski, M. H., Thornton, J. D., & Woodruff, A. (2002). *Sotto Voce: Exploring the interplay of conversation and mobile audio spaces.*

Eklund, L. (2020). A shoe is a shoe is a shoe: Interpersonalization and meaning-making in museums – Research findings and design implications. *International Journal of Human–Computer Interaction, 36*(16), 1503–1513.

Ryding, K., Spence, J., Løvlie, A. S., & Benford, S. (2021). Interpersonalizing intimate museum experiences. *International Journal of Human–Computer Interaction, 37*(12), 1151–1172.

Shaer, O., Olson, J., Edwards, M., & Valdes, C. (2011). *Art App-reciation: Fostering engagement and reflection in museums through a social-mobile application.* Museums and the Web.

Stanković Elesini, U., Miha, H., Kristan, D., Korošec, A., Protić, E., Učakar, A., Vrabič Brodnjak, U., & Rugelj, J. (2022). Mobile serious game for enhancing user experience in museum. *Journal on Computing and Cultural Heritage, 16*(1), 1–26.

Sung, Y.-T., Chang, K.-E., Hou, H.-T., & Chen, P.-F. (2010). Designing an electronic guidebook for learning engagement in a museum of history. *Computers in Human Behavior, 26*(1), 74–83.

Winter, M. (2019). Requirements for an in-gallery social interpretation platform: A museum perspective. *Proceedings of the 3rd International Conference on Computer-Human Interaction Research and Applications*, 66–77.

Yi, T., Lee, H., Yum, J., & Lee, J.-H. (2022). The influence of visitor-based social contextual information on visitors' museum experience. *PLOS ONE, 17*(5), e0266856.