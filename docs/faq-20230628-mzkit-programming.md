# MZKit编程

<!-- 2023-06-28 -->

> Dear Mr.Xie,
>
> I am the user of MZKit. When I run the MZkit workbench software, I encounter one problem like this Screenshot. When I use the '``developer command``', invoking '``r# test.py``', I meet this question. By the way, I have already tried to run '``install_local.cmd``'. Thank you so much! 
>
> Sincerely,
>
> Jianing Yu.

![](/docs/images/faq-images/D42EFED4@6EBF0A7F.51F99B64.jpg)

今天很高兴收到了一封来自以为昵称为“三月兔”的老师的问题反馈来信，来信的内容大致意思为通过MZkit所自带的编程环境进行脚本执行，出现了一个符号被锁定的符号命名冲突问题。出现上面问题的原因主要是老师这边所命名的符号exact_mass和mzkit程序包之中的一个名为exact_mass的函数重名冲突了，所以R#解释器报错无法修改exact_mass符号的值。

![](/docs/images/faq-images/math_exact_mass.PNG)

既然问题现在已经明确了，那么下面我将以这个问题为引子，来讲解如何调用MZKit程序包进行质谱数据编程分析。

## MZKit脚本编程简单介绍

MZKit软件是诺米代谢推出的一款主要应用于质谱数据分析的程序包，其主要分为MZKit Server和MZKit Desktop两部分组成。MZKit Server是一个运行于服务器端的R#编程环境的软件包，MZKit Desktop则是运行于MZkit Server之上的GUI界面程序。二者一同绑定发布：老师您安装了MZKit Workbench之后，就相当于同时安装了MZKit Server和MZKit Desktop。

因为目前MZKit Desktop的GUI界面上只实现了MZKit Server程序包中的一部分代码功能，所以假若老师您需要通过MZKit进行更加深入地质谱数据分析，则需要通过脚本编程的手段进行MZKit功能的调用。启用MZKit脚本执行的环境操作非常的容易，一般老师您只需要从开始菜单中打开【BioNovoGene Developer CommandLine Tool】即可启动MZKit Server编程环境：

![](/docs/images/faq-images/bionovogene-dev-cli.PNG)

在这个命令行环境之中可以支持老师您使用一下三种语言进行MZKit Server编程：

|编程语言|文件拓展名|支持度|
|-------|---------|------|
|R#|*.R|推荐使用R#编程语言进行MZKit的编程调用，R#语言的解释器目前比较成熟稳定|
|Python|*.py|MZKit所附带的Python.NET解释器因为尚在开发中，许多Python语言的语法目前尚未在Python.NET中被实现，目前仅推荐进行简单的编程使用，无法支持复杂的逻辑|
|JavaScript|*.js|同样的，MZKit所附带的JavaScript.NET解释器同样目前也是处于开发中的状态，目前仅推荐进行简单的编程使用，比较复杂的逻辑判断在JavaScript.NET并未被很好的支持|

因为R#语言和R语言虽然二者的语法比较相似，但是

出现上面的符号冲突的原因是因为目前R#的解释器程序的栈环境还不完善所导致的，老师这边可以尝试通过添加``let``关键词来避免这种符号冲突问题，例如在下面的一段R#脚本代码之中，我们实现了将具体的精确分子质量赋值给了exact_mass符号，然后根据这个符号计算出了所有正离子模式下的加合物的m/z值：

```r
require(mzkit);

imports "math" from "mzkit";

let exact_mass = 131.0946;

# evaluate mz from exact mass
exact_mass
|> math::mz(mode = "+")
|> as.data.frame()
|> print()
;

#                        precursor_type   charge        M    adduct                   m/z   ionMode
# --------------------------------------------------------------------------------------------------
# <mode>                       <string> <double> <double>  <double>              <string> <integer>
# [M]+                           "[M]+"        1        1         0            "131.0946"         0
# [M+3H]3+                   "[M+3H]3+"        3        1   1.00728  "44.705476000000004"         0
# [M+2H+Na]3+             "[M+2H+Na]3+"        3        1   8.33459  "52.032790000000006"         0
# [M+H+2Na]3+             "[M+H+2Na]3+"        3        1   15.7662   "59.46439000000001"         0
# [M+3Na]3+                 "[M+3Na]3+"        3        1   22.9892   "66.68741800000001"         0
# [M+2H]2+                   "[M+2H]2+"        2        1   1.00728   "66.55457600000001"         0
# [M+H+NH4]2+             "[M+H+NH4]2+"        2        1   9.52055            "75.06785"         0
# [M+H+Na]2+               "[M+H+Na]2+"        2        1   11.9982           "77.545547"         0
# [M+H+K]2+                 "[M+H+K]2+"        2        1   19.9852   "85.53251700000001"         0
# [M+ACN+2H]2+           "[M+ACN+2H]2+"        2        1   21.5206            "87.06785"         0
# [M+2Na]2+                 "[M+2Na]2+"        2        1   22.9892           "88.536518"         0
# [M+2ACN+2H]2+         "[M+2ACN+2H]2+"        2        1   42.0338          "107.581123"         0
# [M+3ACN+2H]2+         "[M+3ACN+2H]2+"        2        1   62.5471  "128.09439700000001"         0
# [M+H]+                       "[M+H]+"        1        1   1.00728          "132.101876"         0
# [M+Li]+                     "[M+Li]+"        1        1     6.941  "138.03560000000002"         0
# [M-H2O+NH4]+           "[M-H2O+NH4]+"        1        1  0.023809          "131.118409"         0
# [M+H-2H2O]+             "[M+H-2H2O]+"        1        1  -35.0133   "96.08129500000001"         0
# [M+H-H2O]+               "[M+H-H2O]+"        1        1  -17.0027  "114.09186000000001"         0
# [M+NH4]+                   "[M+NH4]+"        1        1   18.0338  "149.12842300000003"         0
# [M+Na]+                     "[M+Na]+"        1        1   22.9892          "154.083818"         0
# [M+CH3OH+H]+           "[M+CH3OH+H]+"        1        1   33.0335  "164.12808900000002"         0
# [M+K]+                       "[M+K]+"        1        1   38.9632          "170.057758"         0
# [M+ACN+H]+               "[M+ACN+H]+"        1        1   42.0338          "173.128423"         0
# [M+2Na-H]+               "[M+2Na-H]+"        1        1   44.9712           "176.06576"         0
# [M+IsoProp+H]+       "[M+IsoProp+H]+"        1        1   61.0653           "192.15994"         0
# [M+ACN+Na]+             "[M+ACN+Na]+"        1        1   64.0158          "195.110365"         0
# [M+2K-H]+                 "[M+2K-H]+"        1        1    76.919           "208.01364"         0
# [M+DMSO+H]+             "[M+DMSO+H]+"        1        1   79.0212           "210.11582"         0
# [M+2ACN+H]+             "[M+2ACN+H]+"        1        1   83.0604  "214.15497000000002"         0
# [M+IsoProp+Na+H]+ "[M+IsoProp+Na+H]+"        1        1   84.0551  "215.14971000000003"         0
# [2M+H]+                     "[2M+H]+"        1        2   1.00728          "263.196476"         0
# [2M+NH4]+                 "[2M+NH4]+"        1        2   18.0338          "280.223023"         0
# [2M+Na]+                   "[2M+Na]+"        1        2   22.9892          "285.178418"         0
# [2M+K]+                     "[2M+K]+"        1        2   38.9632  "301.15235800000005"         0
# [2M+ACN+H]+             "[2M+ACN+H]+"        1        2   42.0338          "304.223023"         0
# [2M+ACN+Na]+           "[2M+ACN+Na]+"        1        2   64.0158          "326.204965"         0
# [M+H-C12H20O9]+     "[M+H-C12H20O9]+"        1        1  -307.103 "-176.00857499999995"         0
```