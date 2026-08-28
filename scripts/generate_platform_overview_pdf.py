from pathlib import Path
from datetime import date

from reportlab.lib import colors
from reportlab.lib.enums import TA_CENTER, TA_LEFT
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import mm
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.platypus import (
    BaseDocTemplate,
    Frame,
    Image,
    KeepTogether,
    PageBreak,
    PageTemplate,
    Paragraph,
    Spacer,
    Table,
    TableStyle,
)


ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "output" / "pdf" / "Spark_Technologies_Platform_Purpose_and_Use_Cases.pdf"
ASSETS = ROOT / "public" / "assets"

PAGE_W, PAGE_H = A4
MARGIN_X = 17 * mm
TOP = 17 * mm
BOTTOM = 16 * mm

INK = colors.HexColor("#172522")
TEXT = colors.HexColor("#3B4B47")
MUTED = colors.HexColor("#6D7B77")
GREEN = colors.HexColor("#0E7C69")
GREEN_DARK = colors.HexColor("#075B4E")
MINT = colors.HexColor("#E5F3EF")
MINT_2 = colors.HexColor("#F2F8F6")
ORANGE = colors.HexColor("#E86C4A")
ORANGE_BG = colors.HexColor("#FFF0EA")
AMBER = colors.HexColor("#C98919")
AMBER_BG = colors.HexColor("#FFF5DF")
BLUE = colors.HexColor("#5270D7")
BLUE_BG = colors.HexColor("#EDF1FF")
RED = colors.HexColor("#C83F45")
RED_BG = colors.HexColor("#FCEAEC")
WHITE = colors.white
LINE = colors.HexColor("#DCE5E2")
PAPER = colors.HexColor("#F8FAF9")


def register_fonts():
    font_dir = Path(r"C:\Windows\Fonts")
    pdfmetrics.registerFont(TTFont("Segoe", str(font_dir / "segoeui.ttf")))
    pdfmetrics.registerFont(TTFont("Segoe-Bold", str(font_dir / "segoeuib.ttf")))
    pdfmetrics.registerFont(TTFont("Segoe-Italic", str(font_dir / "segoeuii.ttf")))


register_fonts()

styles = getSampleStyleSheet()
styles.add(ParagraphStyle(name="BodyX", fontName="Segoe", fontSize=10.1, leading=15.0, textColor=TEXT, spaceAfter=4))
styles.add(ParagraphStyle(name="SmallX", fontName="Segoe", fontSize=8.5, leading=12.2, textColor=MUTED))
styles.add(ParagraphStyle(name="TinyX", fontName="Segoe", fontSize=7.2, leading=9.5, textColor=MUTED))
styles.add(ParagraphStyle(name="TitleX", fontName="Segoe-Bold", fontSize=25, leading=29, textColor=INK, spaceAfter=5))
styles.add(ParagraphStyle(name="H1X", fontName="Segoe-Bold", fontSize=22, leading=26, textColor=INK, spaceAfter=5))
styles.add(ParagraphStyle(name="H2X", fontName="Segoe-Bold", fontSize=13.5, leading=17, textColor=INK, spaceAfter=4))
styles.add(ParagraphStyle(name="H3X", fontName="Segoe-Bold", fontSize=10.2, leading=13, textColor=INK, spaceAfter=2))
styles.add(ParagraphStyle(name="EyebrowX", fontName="Segoe-Bold", fontSize=7.8, leading=10, textColor=GREEN, tracking=1.4, spaceAfter=5))
styles.add(ParagraphStyle(name="WhiteTitle", fontName="Segoe-Bold", fontSize=27, leading=31, textColor=WHITE))
styles.add(ParagraphStyle(name="WhiteBody", fontName="Segoe", fontSize=11.3, leading=17, textColor=colors.HexColor("#D6E7E2")))
styles.add(ParagraphStyle(name="CardBody", fontName="Segoe", fontSize=9, leading=12.7, textColor=TEXT))
styles.add(ParagraphStyle(name="CardTitle", fontName="Segoe-Bold", fontSize=10.5, leading=13.5, textColor=INK, spaceAfter=2))
styles.add(ParagraphStyle(name="CenterSmall", fontName="Segoe", fontSize=8.6, leading=12, textColor=TEXT, alignment=TA_CENTER))
styles.add(ParagraphStyle(name="CenterTitle", fontName="Segoe-Bold", fontSize=10.5, leading=13, textColor=INK, alignment=TA_CENTER))
styles.add(ParagraphStyle(name="QuoteX", fontName="Segoe-Bold", fontSize=15, leading=21, textColor=GREEN_DARK, alignment=TA_LEFT))


def P(text, style="BodyX"):
    return Paragraph(text, styles[style])


def section_head(kicker, title, subtitle=None):
    items = [P(kicker.upper(), "EyebrowX"), P(title, "H1X")]
    if subtitle:
        items.append(P(subtitle, "BodyX"))
    items.append(Spacer(1, 4 * mm))
    return items


def card(title, body, accent=GREEN, width=80 * mm, icon=None):
    icon_text = f'<font color="{accent.hexval()}"><b>{icon}</b></font><br/>' if icon else ""
    content = [P(icon_text + title, "CardTitle"), P(body, "CardBody")]
    table = Table([[content]], colWidths=[width], hAlign="LEFT")
    table.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, -1), WHITE),
        ("BOX", (0, 0), (-1, -1), 0.7, LINE),
        ("LINEBEFORE", (0, 0), (0, -1), 3, accent),
        ("LEFTPADDING", (0, 0), (-1, -1), 10),
        ("RIGHTPADDING", (0, 0), (-1, -1), 10),
        ("TOPPADDING", (0, 0), (-1, -1), 10),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 10),
        ("VALIGN", (0, 0), (-1, -1), "TOP"),
    ]))
    return table


def two_cards(a, b, widths=(84 * mm, 84 * mm)):
    t = Table([[a, b]], colWidths=list(widths), hAlign="LEFT")
    t.setStyle(TableStyle([
        ("VALIGN", (0, 0), (-1, -1), "TOP"),
        ("LEFTPADDING", (0, 0), (-1, -1), 0),
        ("RIGHTPADDING", (0, 0), (0, -1), 4 * mm),
        ("RIGHTPADDING", (1, 0), (1, -1), 0),
    ]))
    return t


def bullet(text, color=GREEN):
    dot = Table([[""]], colWidths=[5], rowHeights=[5])
    dot.setStyle(TableStyle([("BACKGROUND", (0, 0), (-1, -1), color), ("BOX", (0, 0), (-1, -1), 0, color)]))
    t = Table([[dot, P(text, "BodyX")]], colWidths=[7 * mm, 157 * mm])
    t.setStyle(TableStyle([
        ("VALIGN", (0, 0), (-1, -1), "TOP"),
        ("TOPPADDING", (0, 0), (-1, -1), 1),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 2),
        ("LEFTPADDING", (0, 0), (-1, -1), 0),
        ("RIGHTPADDING", (0, 0), (-1, -1), 2),
    ]))
    return t


def step_flow(items, colors_list=None):
    colors_list = colors_list or [GREEN] * len(items)
    cells = []
    for idx, (title, detail) in enumerate(items):
        cell = [P(f"0{idx + 1}", "EyebrowX"), P(title, "CenterTitle"), P(detail, "CenterSmall")]
        cells.append(cell)
    widths = [164 * mm / len(items)] * len(items)
    t = Table([cells], colWidths=widths, hAlign="LEFT")
    commands = [
        ("VALIGN", (0, 0), (-1, -1), "TOP"),
        ("BOX", (0, 0), (-1, -1), 0.7, LINE),
        ("INNERGRID", (0, 0), (-1, -1), 0.7, LINE),
        ("TOPPADDING", (0, 0), (-1, -1), 9),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 9),
        ("LEFTPADDING", (0, 0), (-1, -1), 7),
        ("RIGHTPADDING", (0, 0), (-1, -1), 7),
    ]
    for idx, c in enumerate(colors_list):
        commands.append(("LINEABOVE", (idx, 0), (idx, 0), 4, c))
    t.setStyle(TableStyle(commands))
    return t


def metric(value, label, note, color=GREEN):
    content = [
        Paragraph(value, ParagraphStyle(name=f"m{value}{label}", parent=styles["H1X"], fontSize=22, leading=23, textColor=color, alignment=TA_CENTER)),
        P(label, "CenterTitle"),
        P(note, "CenterSmall"),
    ]
    return content


def machine_image(name, width=52 * mm, height=38 * mm):
    img = Image(str(ASSETS / name), width=width, height=height, kind="proportional")
    img.hAlign = "CENTER"
    return img


def on_page(canvas, doc):
    if doc.page == 1:
        return
    canvas.saveState()
    canvas.setStrokeColor(LINE)
    canvas.setLineWidth(0.6)
    canvas.line(MARGIN_X, 12 * mm, PAGE_W - MARGIN_X, 12 * mm)
    canvas.setFont("Segoe", 7.5)
    canvas.setFillColor(MUTED)
    canvas.drawString(MARGIN_X, 7.5 * mm, "SPARK TECHNOLOGIES  |  PURPOSE AND USE-CASE OVERVIEW")
    canvas.drawRightString(PAGE_W - MARGIN_X, 7.5 * mm, f"{doc.page:02d}")
    canvas.restoreState()


def cover_page(canvas, doc):
    canvas.saveState()
    canvas.setFillColor(GREEN_DARK)
    canvas.rect(0, 0, PAGE_W, PAGE_H, fill=1, stroke=0)
    canvas.setFillColor(colors.HexColor("#0B6D5D"))
    canvas.circle(PAGE_W - 20 * mm, PAGE_H - 25 * mm, 52 * mm, fill=1, stroke=0)
    canvas.setFillColor(colors.HexColor("#108B75"))
    canvas.circle(PAGE_W - 7 * mm, 30 * mm, 46 * mm, fill=1, stroke=0)
    canvas.setFillColor(colors.HexColor("#D9F0E9"))
    canvas.roundRect(MARGIN_X, PAGE_H - 34 * mm, 48 * mm, 10 * mm, 3 * mm, fill=1, stroke=0)
    canvas.setFillColor(GREEN_DARK)
    canvas.setFont("Segoe-Bold", 9)
    canvas.drawString(MARGIN_X + 3.5 * mm, PAGE_H - 27.5 * mm, "Spark Technologies")
    canvas.setFillColor(WHITE)
    canvas.setFont("Segoe-Bold", 28)
    canvas.drawString(MARGIN_X, PAGE_H - 68 * mm, "Textile Intelligence")
    canvas.drawString(MARGIN_X, PAGE_H - 81 * mm, "and Operations Platform")
    canvas.setFont("Segoe", 12.5)
    canvas.setFillColor(colors.HexColor("#D8E9E4"))
    canvas.drawString(MARGIN_X, PAGE_H - 96 * mm, "Purpose, operating concept and business use cases")
    canvas.setStrokeColor(colors.HexColor("#6CB6A5"))
    canvas.setLineWidth(1)
    canvas.line(MARGIN_X, PAGE_H - 106 * mm, 118 * mm, PAGE_H - 106 * mm)
    canvas.setFont("Segoe", 10)
    canvas.drawString(MARGIN_X, 28 * mm, "A clear, non-technical guide to what the platform is intended to achieve")
    canvas.setFont("Segoe", 8.5)
    canvas.setFillColor(colors.HexColor("#B8D5CD"))
    canvas.drawString(MARGIN_X, 20 * mm, "Prepared 27 August 2026  |  Concept overview")
    canvas.restoreState()


class SparkTechnologiesDoc(BaseDocTemplate):
    def __init__(self, filename):
        super().__init__(filename, pagesize=A4, rightMargin=MARGIN_X, leftMargin=MARGIN_X, topMargin=TOP, bottomMargin=BOTTOM)
        frame = Frame(MARGIN_X, BOTTOM, PAGE_W - 2 * MARGIN_X, PAGE_H - TOP - BOTTOM, id="main")
        self.addPageTemplates([
            PageTemplate(id="content", frames=[frame], onPage=on_page),
        ])


def build_story():
    s = []

    # Cover is drawn directly; content is intentionally blank.
    s += [Spacer(1, 245 * mm), PageBreak()]

    s += section_head("Executive brief", "Why this platform exists", "A single operating view for reliability, quality and production decisions across a textile and apparel plant.")
    s.append(P("Spark Technologies is designed to help a textile business see what is happening, understand what needs attention, and coordinate the right response before disruption becomes waste, delay or customer risk.", "QuoteX"))
    s.append(Spacer(1, 6 * mm))
    s.append(two_cards(
        card("The purpose", "Bring machine condition, maintenance work, colour quality, fabric inspection and apparel production flow into one understandable operating picture.", GREEN, 80 * mm, "01"),
        card("The central promise", "Move teams from scattered information and late reaction to earlier warning, shared evidence and a clearly owned action.", ORANGE, 80 * mm, "02"),
    ))
    s.append(Spacer(1, 5 * mm))
    s.append(P("What the experience demonstrates", "H2X"))
    for text in [
        "A plant-wide overview that highlights health, active risk, current alerts and open work.",
        "A guided journey from an unusual operating pattern to investigation, maintenance and verification.",
        "Colour decisions that combine customer rules, live batch behaviour and comparable production history.",
        "Fabric defect mapping that keeps the roll position, inspection evidence and likely production source connected.",
        "Apparel line visibility from cutting to packing, including bottlenecks, work-in-progress and output against target.",
        "Notifications, audit history and an operations assistant that help people find and act on the right information.",
    ]:
        s.append(bullet(text))
    s.append(Spacer(1, 4 * mm))
    s.append(P("This is an operating concept, not a claim that every plant data source or business process is already connected. Its role is to make the intended future way of working visible, discussable and testable.", "SmallX"))
    s.append(PageBreak())

    s += section_head("The business challenge", "Why textile operations need a connected view", "The most costly problems rarely belong to only one department.")
    challenges = [
        ("Warning signs are fragmented", "Machine behaviour, quality observations and maintenance notes often sit in different places. The relationship between them is discovered late."),
        ("Action begins after impact", "A stoppage, rejected shade, damaged roll or missed output target can become visible only after rework, delay or material loss has already occurred."),
        ("Teams see different versions", "Operations, maintenance, quality and management may each have a partial view, creating long handovers and disagreement about priority."),
        ("Knowledge depends on individuals", "Experienced people know which signals matter, but that reasoning may not be consistently recorded or available to the next shift."),
        ("Proof is difficult to assemble", "When a customer or auditor asks what happened, who acted and why, the evidence may need to be reconstructed manually."),
        ("Improvements are hard to repeat", "A successful correction on one machine, batch or line is not always captured in a way that helps the rest of the plant."),
    ]
    rows = []
    for i in range(0, len(challenges), 2):
        rows.append([
            card(challenges[i][0], challenges[i][1], [GREEN, ORANGE, AMBER][i // 2], 80 * mm, f"0{i+1}"),
            card(challenges[i+1][0], challenges[i+1][1], [GREEN, ORANGE, AMBER][i // 2], 80 * mm, f"0{i+2}"),
        ])
    grid = Table(rows, colWidths=[84 * mm, 84 * mm], hAlign="LEFT")
    grid.setStyle(TableStyle([
        ("VALIGN", (0, 0), (-1, -1), "TOP"),
        ("LEFTPADDING", (0, 0), (-1, -1), 0),
        ("RIGHTPADDING", (0, 0), (0, -1), 4 * mm),
        ("RIGHTPADDING", (1, 0), (1, -1), 0),
        ("TOPPADDING", (0, 0), (-1, -1), 0),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 4 * mm),
    ]))
    s.append(grid)
    s.append(Spacer(1, 2 * mm))
    s.append(Table([[P("The platform addresses these gaps by making the complete decision journey visible: what changed, why it matters, who owns the response, what was done, and whether the outcome was verified.", "BodyX")]], colWidths=[168 * mm], style=TableStyle([
        ("BACKGROUND", (0, 0), (-1, -1), MINT),
        ("BOX", (0, 0), (-1, -1), 0, MINT),
        ("LEFTPADDING", (0, 0), (-1, -1), 12),
        ("RIGHTPADDING", (0, 0), (-1, -1), 12),
        ("TOPPADDING", (0, 0), (-1, -1), 10),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 10),
    ])))
    s.append(PageBreak())

    s += section_head("The operating idea", "From plant signal to verified outcome", "The platform is organised around a simple business loop rather than a collection of disconnected dashboards.")
    s.append(step_flow([
        ("Observe", "See machine, batch, roll, line and work status in context."),
        ("Understand", "Combine related evidence and explain why attention is needed."),
        ("Decide", "Present the next best action while keeping people in control."),
        ("Act", "Create an investigation, maintenance task or quality review."),
        ("Verify", "Record the result and confirm whether risk or quality improved."),
    ], [BLUE, GREEN, AMBER, ORANGE, GREEN_DARK]))
    s.append(Spacer(1, 8 * mm))
    s.append(P("How the plant is represented", "H2X"))
    plant_flow = [
        ("Preparation", "Spinning and warp preparation"),
        ("Fabric formation", "Weaving and machine reliability"),
        ("Wet processing", "Dyeing, recipe and shade outcome"),
        ("Finishing", "Stenter condition and process stability"),
        ("Garment making", "Cutting, sewing, quality and packing"),
    ]
    s.append(step_flow(plant_flow, [GREEN, GREEN, BLUE, AMBER, ORANGE]))
    s.append(Spacer(1, 8 * mm))
    s.append(two_cards(
        card("Connected objects", "Assets, alerts, investigations, work orders, batches, rolls, orders and customer standards remain linked so users can follow the story without losing context.", GREEN, 80 * mm),
        card("Connected people", "Operations, maintenance, reliability, quality and leadership work from a shared picture while retaining their own responsibilities and approvals.", BLUE, 80 * mm),
    ))
    s.append(Spacer(1, 6 * mm))
    s.append(P("The goal is not automation for its own sake. The goal is faster, better-supported decisions with clear responsibility and a traceable outcome.", "QuoteX"))
    s.append(PageBreak())

    s += section_head("Use case 1", "Predictive maintenance for critical equipment", "Identify an emerging reliability concern early, explain the evidence and coordinate a controlled response.")
    img_row = Table([[machine_image("air-jet-loom.png", 65 * mm, 47 * mm), [P("Representative scenario", "EyebrowX"), P("Air-jet loom AJ-003 begins to behave differently from its recent normal pattern.", "H2X"), P("Vibration, temperature, miss-picks and unplanned stops move together. The platform raises the asset's risk and shows the contributing evidence, instead of presenting a single unexplained warning.", "BodyX")]]], colWidths=[72 * mm, 96 * mm])
    img_row.setStyle(TableStyle([("VALIGN", (0, 0), (-1, -1), "MIDDLE"), ("BACKGROUND", (0, 0), (-1, -1), MINT_2), ("BOX", (0, 0), (-1, -1), 0.7, LINE), ("LEFTPADDING", (0, 0), (-1, -1), 10), ("RIGHTPADDING", (0, 0), (-1, -1), 10), ("TOPPADDING", (0, 0), (-1, -1), 10), ("BOTTOMPADDING", (0, 0), (-1, -1), 10)]))
    s.append(img_row)
    s.append(Spacer(1, 7 * mm))
    s.append(step_flow([
        ("Early warning", "Related signs move beyond the recent operating baseline."),
        ("Prioritised alert", "The concern is ranked against other plant risks."),
        ("Investigation", "Evidence, timing and asset history are reviewed together."),
        ("Maintenance action", "A work order is assigned with owner, due time and priority."),
        ("Verification", "The team records findings and confirms the asset response."),
    ], [AMBER, ORANGE, BLUE, GREEN, GREEN_DARK]))
    s.append(Spacer(1, 7 * mm))
    s.append(two_cards(
        card("Business value", "Reduce surprise stoppages, protect production commitments, focus maintenance effort where it matters, and preserve the reasoning behind each intervention.", GREEN, 80 * mm),
        card("Human responsibility", "The platform identifies unusual behaviour and supports prioritisation. A qualified person still confirms the physical cause and approves maintenance action.", ORANGE, 80 * mm),
    ))
    s.append(Spacer(1, 6 * mm))
    s.append(P("Who uses it", "H2X"))
    s.append(bullet("The reliability engineer reviews why the alert was created and compares it with the asset's recent history."))
    s.append(bullet("The maintenance supervisor assigns the correct team and tracks progress."))
    s.append(bullet("The production manager understands the likely operational exposure and plans around it."))
    s.append(PageBreak())

    s += section_head("Use case 2", "Color intelligence during dyeing", "Support an on-time shade decision while the batch can still be influenced, then verify the final result against the customer rule.")
    color_intro = Table([[[P("The intended decision", "EyebrowX"), P("Will this batch finish within the approved colour tolerance?", "H2X"), P("The platform brings together the approved recipe, comparable lot history, the live batch curve and the customer's acceptance limit. It predicts the likely final shade and explains any recommended correction.", "BodyX")], machine_image("jet-dyeing.png", 62 * mm, 44 * mm)]], colWidths=[101 * mm, 67 * mm])
    color_intro.setStyle(TableStyle([("VALIGN", (0, 0), (-1, -1), "MIDDLE"), ("BACKGROUND", (0, 0), (-1, -1), BLUE_BG), ("BOX", (0, 0), (-1, -1), 0.7, LINE), ("LEFTPADDING", (0, 0), (-1, -1), 10), ("RIGHTPADDING", (0, 0), (-1, -1), 10), ("TOPPADDING", (0, 0), (-1, -1), 10), ("BOTTOMPADDING", (0, 0), (-1, -1), 10)]))
    s.append(color_intro)
    s.append(Spacer(1, 7 * mm))
    s.append(step_flow([
        ("Approved standard", "The customer's expected colour and allowed tolerance are clear."),
        ("Live prediction", "The likely final shade is updated as the batch progresses."),
        ("Explained option", "The operator sees what action is suggested and why."),
        ("Operator decision", "The recommendation is reviewed, accepted or declined."),
        ("Final proof", "The instrument reading confirms pass or fail at completion."),
    ], [BLUE, GREEN, AMBER, ORANGE, GREEN_DARK]))
    s.append(Spacer(1, 7 * mm))
    delta_box = Table([[machine_image("spectrophotometer.png", 43 * mm, 31 * mm), [P("A note on colour measurement", "H3X"), P("Delta E is the numerical distance between the measured colour and the approved standard. A lower number means a closer match. The customer's configured threshold determines whether the result passes.", "CardBody")]]], colWidths=[50 * mm, 118 * mm])
    delta_box.setStyle(TableStyle([("VALIGN", (0, 0), (-1, -1), "MIDDLE"), ("BACKGROUND", (0, 0), (-1, -1), MINT_2), ("BOX", (0, 0), (-1, -1), 0.7, LINE), ("LEFTPADDING", (0, 0), (-1, -1), 8), ("RIGHTPADDING", (0, 0), (-1, -1), 10), ("TOPPADDING", (0, 0), (-1, -1), 8), ("BOTTOMPADDING", (0, 0), (-1, -1), 8)]))
    s.append(delta_box)
    s.append(Spacer(1, 7 * mm))
    s.append(two_cards(
        card("Business value", "Reduce re-dyeing, chemical use, energy loss, batch delay and customer claims while improving first-time-right production.", GREEN, 80 * mm),
        card("Control boundary", "The prediction informs the operator. Final batch acceptance remains a quality decision supported by the approved instrument reading and customer rule.", ORANGE, 80 * mm),
    ))
    s.append(PageBreak())

    s += section_head("Use cases 3 and 4", "Fabric inspection and apparel production flow", "Carry quality evidence forward and make the garment line easier to balance.")
    vision = card("Fabric inspection", "A vision-assisted inspection maps each visible defect to its exact position on the roll. The record preserves the classification confidence, roll, production batch and probable loom source so the issue can be reviewed and traced.", BLUE, 80 * mm, "01")
    apparel = card("Apparel production control", "A live line view follows an order through cutting, bundling, sewing, inline quality, finishing and packing. It highlights where work is building up and how actual output compares with the target.", ORANGE, 80 * mm, "02")
    s.append(two_cards(vision, apparel))
    s.append(Spacer(1, 7 * mm))
    machine_table = Table([
        [machine_image("air-jet-loom.png", 50 * mm, 34 * mm), machine_image("sewing-machine.png", 50 * mm, 34 * mm)],
        [P("Defect evidence can be connected back to the roll, batch and source loom.", "CenterSmall"), P("Line flow shows the bottleneck and the likely recovery opportunity.", "CenterSmall")],
    ], colWidths=[84 * mm, 84 * mm])
    machine_table.setStyle(TableStyle([("VALIGN", (0, 0), (-1, -1), "MIDDLE"), ("BACKGROUND", (0, 0), (-1, -1), MINT_2), ("BOX", (0, 0), (-1, -1), 0.7, LINE), ("INNERGRID", (0, 0), (-1, -1), 0.7, LINE), ("TOPPADDING", (0, 0), (-1, -1), 8), ("BOTTOMPADDING", (0, 0), (-1, -1), 8), ("LEFTPADDING", (0, 0), (-1, -1), 8), ("RIGHTPADDING", (0, 0), (-1, -1), 8)]))
    s.append(machine_table)
    s.append(Spacer(1, 7 * mm))
    s.append(P("The combined business story", "H2X"))
    s.append(step_flow([
        ("Detect", "A fabric issue is found and located."),
        ("Trace", "The roll, batch and production source remain linked."),
        ("Contain", "Quality decides how the affected material should be handled."),
        ("Plan", "The apparel line sees the order and material context."),
        ("Recover", "Supervisors rebalance people or work to protect output."),
    ], [BLUE, GREEN, AMBER, ORANGE, GREEN_DARK]))
    s.append(Spacer(1, 7 * mm))
    s.append(P("Together, these views demonstrate a path from fabric creation to finished garment: quality is not treated as an isolated final check, and production flow is not separated from the material evidence that affects it.", "BodyX"))
    s.append(PageBreak())

    s += section_head("People and decisions", "How different teams use the same operating picture", "Each role sees the decisions it owns, while the underlying evidence remains shared.")
    roles = [
        ("Plant leadership", "Where is operational risk concentrated? Which issues threaten output, cost or customer commitments?"),
        ("Production manager", "Which asset, batch or line needs attention now? What is the likely impact on today's plan?"),
        ("Reliability engineer", "Why did risk increase? Which signals contributed, and what should be investigated?"),
        ("Maintenance supervisor", "Which work is urgent, who owns it, when is it due, and has the outcome been verified?"),
        ("Quality manager", "Does the batch meet the customer rule? What evidence supports the decision and where did the issue originate?"),
        ("Line supervisor", "Where is work accumulating? Can labour or bundle flow be adjusted to recover output?"),
    ]
    role_rows = []
    for i in range(0, len(roles), 2):
        role_rows.append([card(roles[i][0], roles[i][1], GREEN if i < 4 else BLUE, 80 * mm), card(roles[i+1][0], roles[i+1][1], ORANGE if i < 4 else AMBER, 80 * mm)])
    role_grid = Table(role_rows, colWidths=[84 * mm, 84 * mm])
    role_grid.setStyle(TableStyle([("VALIGN", (0, 0), (-1, -1), "TOP"), ("LEFTPADDING", (0, 0), (-1, -1), 0), ("RIGHTPADDING", (0, 0), (0, -1), 4 * mm), ("RIGHTPADDING", (1, 0), (1, -1), 0), ("TOPPADDING", (0, 0), (-1, -1), 0), ("BOTTOMPADDING", (0, 0), (-1, -1), 4 * mm)]))
    s.append(role_grid)
    s.append(Spacer(1, 4 * mm))
    s.append(P("A typical shift rhythm", "H2X"))
    s.append(step_flow([
        ("Start of shift", "Review health, priorities and due work."),
        ("During production", "Monitor exceptions and respond to alerts."),
        ("Decision point", "Approve maintenance or quality action."),
        ("Shift handover", "Pass forward open cases and evidence."),
        ("Review", "Compare outcomes and identify repeated patterns."),
    ]))
    s.append(PageBreak())

    s += section_head("Trust and adoption", "Why the platform remains explainable", "Useful intelligence must be understandable, governed and connected to human accountability.")
    trust_items = [
        ("Evidence before recommendation", "The platform shows the contributing signals, history or process conditions behind a warning or suggestion."),
        ("People approve consequential action", "Maintenance, colour correction and final quality acceptance remain controlled decisions, not silent automation."),
        ("Notifications bring attention", "Urgent reliability, maintenance and quality events are surfaced with category, timing and a direct path to the relevant record."),
        ("The assistant helps users navigate", "A conversational operations guide can summarise the current context, explain an alert or direct a user to the right workflow."),
        ("Changes are traceable", "Important configuration and workflow events record who acted, when it happened and what changed."),
        ("Boundaries are visible", "The experience distinguishes an unusual pattern from a confirmed physical cause and a prediction from final acceptance."),
    ]
    rows = []
    accents = [GREEN, BLUE, AMBER, ORANGE, GREEN_DARK, RED]
    for i in range(0, 6, 2):
        rows.append([card(trust_items[i][0], trust_items[i][1], accents[i], 80 * mm), card(trust_items[i+1][0], trust_items[i+1][1], accents[i+1], 80 * mm)])
    table = Table(rows, colWidths=[84 * mm, 84 * mm])
    table.setStyle(TableStyle([("VALIGN", (0, 0), (-1, -1), "TOP"), ("LEFTPADDING", (0, 0), (-1, -1), 0), ("RIGHTPADDING", (0, 0), (0, -1), 4 * mm), ("RIGHTPADDING", (1, 0), (1, -1), 0), ("TOPPADDING", (0, 0), (-1, -1), 0), ("BOTTOMPADDING", (0, 0), (-1, -1), 4 * mm)]))
    s.append(table)
    s.append(Spacer(1, 6 * mm))
    s.append(Table([[P("The intended outcome is confidence: a user should be able to understand why an item appears, what they are expected to do, and where the final responsibility sits.", "QuoteX")]], colWidths=[168 * mm], style=TableStyle([("BACKGROUND", (0, 0), (-1, -1), MINT), ("LEFTPADDING", (0, 0), (-1, -1), 12), ("RIGHTPADDING", (0, 0), (-1, -1), 12), ("TOPPADDING", (0, 0), (-1, -1), 12), ("BOTTOMPADDING", (0, 0), (-1, -1), 12)])))
    s.append(PageBreak())

    s += section_head("Business impact", "What success would look like", "The platform should be evaluated against operating outcomes, not the number of screens it contains.")
    metrics = [
        metric("Earlier", "Risk visibility", "More warning time before production impact", GREEN),
        metric("Faster", "Response", "Shorter time from alert to owned action", ORANGE),
        metric("Higher", "First-time-right quality", "Fewer colour and fabric corrections", BLUE),
        metric("Clearer", "Accountability", "Every priority has an owner and status", GREEN_DARK),
    ]
    mt = Table([metrics], colWidths=[42 * mm] * 4)
    mt.setStyle(TableStyle([("VALIGN", (0, 0), (-1, -1), "TOP"), ("BOX", (0, 0), (-1, -1), 0.7, LINE), ("INNERGRID", (0, 0), (-1, -1), 0.7, LINE), ("BACKGROUND", (0, 0), (-1, -1), WHITE), ("TOPPADDING", (0, 0), (-1, -1), 10), ("BOTTOMPADDING", (0, 0), (-1, -1), 10), ("LEFTPADDING", (0, 0), (-1, -1), 6), ("RIGHTPADDING", (0, 0), (-1, -1), 6)]))
    s.append(mt)
    s.append(Spacer(1, 8 * mm))
    outcomes = [
        ("Reliability", "Unplanned downtime, time to acknowledge, time to action, repeat alerts, verified maintenance effectiveness."),
        ("Color quality", "First-pass shade acceptance, re-dye rate, correction frequency, energy and chemical cost per accepted batch."),
        ("Fabric quality", "Defect density, containment speed, repeat defect patterns, trace-back completeness and customer claim rate."),
        ("Apparel flow", "Line efficiency, output against target, work-in-progress, bottleneck duration, quality defects and on-time completion."),
        ("Adoption", "Active users by role, alert follow-through, case closure quality, handover completeness and assistant usefulness."),
        ("Governance", "Percentage of actions with an owner, reason, timestamp and verified outcome."),
    ]
    rows = []
    for i in range(0, 6, 2):
        rows.append([card(outcomes[i][0], outcomes[i][1], GREEN, 80 * mm), card(outcomes[i+1][0], outcomes[i+1][1], BLUE, 80 * mm)])
    ot = Table(rows, colWidths=[84 * mm, 84 * mm])
    ot.setStyle(TableStyle([("VALIGN", (0, 0), (-1, -1), "TOP"), ("LEFTPADDING", (0, 0), (-1, -1), 0), ("RIGHTPADDING", (0, 0), (0, -1), 4 * mm), ("RIGHTPADDING", (1, 0), (1, -1), 0), ("TOPPADDING", (0, 0), (-1, -1), 0), ("BOTTOMPADDING", (0, 0), (-1, -1), 4 * mm)]))
    s.append(ot)
    s.append(Spacer(1, 3 * mm))
    s.append(P("Targets should be agreed with the plant before rollout. The current experience illustrates the measurement approach; it does not claim achieved savings.", "SmallX"))
    s.append(PageBreak())

    s += section_head("Future opportunity", "Digital Product Passport readiness", "The current work establishes useful traceability foundations, but it is not yet a complete Digital Product Passport.")
    s.append(two_cards(
        card("Foundations already represented", "Order, style, customer, lot, batch, machine, roll defect, colour result, maintenance action and audit events can be connected into a product and process history.", GREEN, 80 * mm),
        card("What a complete passport adds", "A unique product identity, material origin and composition, supplier journey, environmental evidence, certifications, care guidance, end-of-life information and controlled external access.", BLUE, 80 * mm),
    ))
    s.append(Spacer(1, 7 * mm))
    s.append(P("Conceptual passport journey", "H2X"))
    s.append(step_flow([
        ("Materials", "Fibre content, source and supplier evidence."),
        ("Manufacturing", "Where and when each major process occurred."),
        ("Quality", "Shade, fabric and garment verification records."),
        ("Impact", "Water, energy, carbon and chemical information."),
        ("Access", "A secure QR-linked view for the right audience."),
    ], [GREEN, GREEN, BLUE, AMBER, ORANGE]))
    s.append(Spacer(1, 8 * mm))
    s.append(P("Why this matters", "H2X"))
    for item in [
        "Give customers a clearer, evidence-based account of how a product was made.",
        "Reduce the manual effort required to assemble compliance and sustainability information.",
        "Connect product claims to actual production and quality records rather than separate documents.",
        "Support repair, resale, recycling and more responsible end-of-life decisions.",
    ]:
        s.append(bullet(item))
    s.append(Spacer(1, 5 * mm))
    s.append(Table([[P("Recommended next step", "EyebrowX"), P("Create a dedicated passport registry and a detailed passport view for a representative order, lot and batch. Use the existing operational records as evidence, then identify the missing supplier, material and sustainability data owners.", "BodyX")]], colWidths=[38 * mm, 130 * mm], style=TableStyle([("BACKGROUND", (0, 0), (-1, -1), MINT), ("VALIGN", (0, 0), (-1, -1), "TOP"), ("LEFTPADDING", (0, 0), (-1, -1), 10), ("RIGHTPADDING", (0, 0), (-1, -1), 10), ("TOPPADDING", (0, 0), (-1, -1), 11), ("BOTTOMPADDING", (0, 0), (-1, -1), 11)])))
    s.append(PageBreak())

    s += section_head("Scope and next conversation", "What this work is - and what it is not", "A strong concept is valuable because it helps the business agree on the future operating model before committing to full rollout.")
    s.append(two_cards(
        card("What it is", "A detailed, interactive representation of how a connected textile operations platform can support daily reliability, maintenance, quality and production decisions.", GREEN, 80 * mm),
        card("What it is not", "A certification that every machine, plant source, workflow, customer standard or sustainability record is already integrated and production-ready.", RED, 80 * mm),
    ))
    s.append(Spacer(1, 7 * mm))
    s.append(P("The decisions this work should enable", "H2X"))
    decisions = [
        ("01", "Prioritise the highest-value use cases", "Agree whether the first rollout should focus on loom reliability, dyeing and shade quality, fabric inspection, apparel flow, or a staged combination."),
        ("02", "Confirm operational ownership", "Identify who receives alerts, approves actions, maintains standards, closes work and reviews outcomes."),
        ("03", "Validate plant data availability", "Confirm which machine readings, batch records, laboratory results and production events can be connected reliably."),
        ("04", "Set measurable success targets", "Define the expected change in downtime, response time, first-pass quality, rework, line efficiency and traceability."),
        ("05", "Plan adoption and governance", "Design the shift routine, escalation rules, approval boundaries, training and management review."),
    ]
    for num, title, detail in decisions:
        row = Table([[P(num, "EyebrowX"), [P(title, "H3X"), P(detail, "CardBody")]]], colWidths=[14 * mm, 154 * mm])
        row.setStyle(TableStyle([("BACKGROUND", (0, 0), (-1, -1), WHITE), ("BOX", (0, 0), (-1, -1), 0.7, LINE), ("LINEBEFORE", (0, 0), (0, -1), 3, GREEN), ("VALIGN", (0, 0), (-1, -1), "TOP"), ("LEFTPADDING", (0, 0), (-1, -1), 9), ("RIGHTPADDING", (0, 0), (-1, -1), 9), ("TOPPADDING", (0, 0), (-1, -1), 8), ("BOTTOMPADDING", (0, 0), (-1, -1), 8)]))
        s.append(row)
        s.append(Spacer(1, 3 * mm))
    s.append(Spacer(1, 5 * mm))
    s.append(Table([[P("The point of the platform", "EyebrowX"), P("To turn complex plant activity into a shared, explainable and actionable operating picture - helping textile and apparel teams protect equipment, quality, output and customer trust.", "QuoteX")]], colWidths=[42 * mm, 126 * mm], style=TableStyle([("BACKGROUND", (0, 0), (-1, -1), MINT), ("VALIGN", (0, 0), (-1, -1), "TOP"), ("LEFTPADDING", (0, 0), (-1, -1), 12), ("RIGHTPADDING", (0, 0), (-1, -1), 12), ("TOPPADDING", (0, 0), (-1, -1), 13), ("BOTTOMPADDING", (0, 0), (-1, -1), 13)])))
    return s


def main():
    OUT.parent.mkdir(parents=True, exist_ok=True)
    doc = SparkTechnologiesDoc(str(OUT))
    # The cover is a separate template callback for the first page.
    doc.pageTemplates[0].onPage = lambda canvas, d: cover_page(canvas, d) if d.page == 1 else on_page(canvas, d)
    doc.build(build_story())
    print(OUT)


if __name__ == "__main__":
    main()
